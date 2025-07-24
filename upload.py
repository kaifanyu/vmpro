import pandas as pd
import mysql.connector

# Constants
EXCEL_PATH = "emp.xlsx"
PASSWORD_HASH = "scrypt:32768:8:1$N1J0PfHzPblQ3gHx$5468bd378408578c3ccae18ba893764e750ae67d1587ead6eb33ac5ad58fbcf32d86ee85b3240787f4a136bc110cd5e84a448cf668de446b9cda482bb23064d6"

# MySQL credentials
DB_CONFIG = {
    "host": "172.21.3.147",
    "port": 6033,
    "user": "user_vms",
    "password": "jypxB6bqyzDCymqj",
    "database": "vms"
}

# Read Excel file
df = pd.read_excel(EXCEL_PATH)

# Clean and prepare the data
df_cleaned = df[["Preferred/First Name", "Work Email", "Work Phone"]].copy()
df_cleaned.columns = ["name", "email", "phone"]
df_cleaned = df_cleaned.dropna(subset=["email"])  # email is required
df_cleaned["phone"] = df_cleaned["phone"].where(df_cleaned["phone"].notnull(), None)
df_cleaned["password_hash"] = PASSWORD_HASH
df_cleaned["role"] = "staff"
df_cleaned["profile_photo"] = None

# Connect to MySQL
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

# Prepare SQL insert statement
insert_query = """
INSERT INTO employees (name, email, phone, password_hash, role, profile_photo)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Insert each row
for _, row in df_cleaned.iterrows():
    data = (
        row["name"],
        row["email"],
        row["phone"],
        row["password_hash"],
        row["role"],
        row["profile_photo"],
    )
    try:
        cursor.execute(insert_query, data)
    except mysql.connector.errors.IntegrityError as e:
        print(f"Skipping duplicate or error for {row['email']}: {e}")

# Commit and close
conn.commit()
cursor.close()
conn.close()

print("Employee data inserted successfully.")
