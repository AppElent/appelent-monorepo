import os
import json

def create_dotted_paths(input_dict, prefix=None):
    output_dict = {}
    for key, value in input_dict.items():
        if prefix:
            dotted_path = f"{prefix}.{key}"
        else:
            dotted_path = key

        if isinstance(value, dict):
            output_dict[key] = create_dotted_paths(value, dotted_path)
        else:
            output_dict[key] = dotted_path
    return output_dict

input_dict = {
    "title": "Satisfactory",
    "nested_test": {"nested_key": "nested value"},
    "products": "Products",
    "product_details": "Product details",
    "games": "Games"
}

def process_folder(folder_path):
    results = {}
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            with open(os.path.join(folder_path, filename), 'r') as f:
                data = json.load(f)
                dotted_paths = create_dotted_paths(data)
                results[os.path.splitext(filename)[0]] = dotted_paths
    return results

def write_to_output_file(results, output_file_path):
    with open(output_file_path, 'w') as f:
        f.write('const output = ')
        json.dump(results, f, indent=2)
        f.write('\n')


folder_path = '/path/to/folder'
output_file_path = '/path/to/output.js'

results = process_folder(folder_path)
write_to_output_file(results, output_file_path)