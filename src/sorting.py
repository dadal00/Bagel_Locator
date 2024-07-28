# import csv

# def load_column_to_array(file_path, column_name):
#     array = []
#     with open(file_path, mode='r') as csv_file:
#         csv_reader = csv.DictReader(csv_file)
#         for row in csv_reader:
#             array.append(row[column_name])
#     return array

# # Example usage
# file_path = 'src/export.csv'
# column_name = 'Address'
# array = load_column_to_array(file_path, column_name)

# import json

# def load_attribute_to_array(file_path, attribute_name):
#     array = []
#     with open(file_path, mode='r') as json_file:
#         data = json.load(json_file)
#         if isinstance(data, list):
#             for item in data:
#                 if attribute_name in item:
#                     array.append(item[attribute_name])
#         else:
#             if attribute_name in data:
#                 array.append(data[attribute_name])
#     return array

# # Example usage
# file_path = 'src/stores.json'
# attribute_name = 'address'
# array2 = load_attribute_to_array(file_path, attribute_name)

# def find_unique_elements(array1, array2):
#     set1 = set(array1)
#     set2 = set(array2)
    
#     unique_in_array1 = set1 - set2
#     unique_in_array2 = set2 - set1
    
#     return list(unique_in_array1), list(unique_in_array2)

# unique_in_array1, unique_in_array2 = find_unique_elements(array, array2)
# print("Unique in array1:", unique_in_array1)
# print("Unique in array2:", unique_in_array2)

# import json
# import pandas as pd

# def json_to_csv(json_file_path, csv_file_path):
#     # Load the JSON file
#     with open(json_file_path, mode='r') as json_file:
#         data = json.load(json_file)
    
#     processed = []
#     for item in data:
#         item['latitude'] = item['latlng']['latitude']
#         item['longitude'] = item['latlng']['longitude']

#         processed.append(item)
#     # Convert JSON data to DataFrame
#     df = pd.DataFrame(data)
    
#     # Save DataFrame to CSV
#     df.to_csv(csv_file_path, index=False)

# # Example usage
# json_file_path = 'src/stores.json'
# csv_file_path = 'src/export_fix.csv'
# json_to_csv(json_file_path, csv_file_path)
# print(f"JSON data has been converted to CSV and saved as {csv_file_path}")

import csv
import json

def search_keywords_in_csv(csv_file_path, column_name, keywords):
    matching_rows = []

    # Open the CSV file
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        # Check if the column exists
        if column_name not in reader.fieldnames:
            raise ValueError(f"Column '{column_name}' not found in the CSV file.")

        # Iterate through each row in the CSV
        for row in reader:
            # Check if any keyword is in the specified column
            cell_value = row[column_name]
            if any(keyword in cell_value for keyword in keywords):
                matching_rows.append(row)

    return matching_rows

def save_to_json(data, json_file_path):
    # Write the data to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)
        print(f"Data has been written to {json_file_path}")

# Example usage
csv_file_path = 'src/export.csv'  # Replace with your CSV file path
column_name = 'Address'  # Replace with the column you want to search
keywords = ['3540 Mt. Diablo Blvd', '1946 Fillmore St', '2050 Wyatt Dr.', '1550 Shattuck Ave', '13159 Central Ave', '3665 Sacramento St', '6240 CA-9', '721 S State St']
json_file_path = 'src/temporary.json'  # Replace with the path to your output JSON file

# Search for matching rows in the CSV file
matching_rows = search_keywords_in_csv(csv_file_path, column_name, keywords)

# Save the matching rows to a JSON file
save_to_json(matching_rows, json_file_path)