import re

# Read the file
with open('src/lib/email-notifications.ts', 'r') as f:
    content = f.read()

# Pattern to find template functions
pattern = r'template:\s*\(([^)]+)\)\s*=>'

def replace_template(match):
    params = match.group(1)
    # Convert individual params to object
    if ': string' in params or ': number' in params:
        # It's individual params like (name: string, submissionId: string)
        param_names = [p.split(':')[0].strip() for p in params.split(',')]
        obj_type = '{ ' + ', '.join([f'{p}: string' for p in param_names]) + ' }'
        return f'template: (data: {obj_type}) =>'
    else:
        # Already an object or no params
        return match.group(0)

# Replace all template functions
new_content = re.sub(pattern, replace_template, content)

# Now update template usage inside functions
# Need to replace ${param} with ${data.param}
for i in range(1, 10):  # Assume max 9 parameters
    param_pattern = rf'\$\{{\s*(\w+)\s*\}}'
    def replace_usage(match):
        param = match.group(1)
        # Check if it's a common template variable
        if param in ['name', 'submissionId', 'membershipType', 'paymentId', 'resetLink', 'magicLink', 'expiresIn']:
            return f'${{data.{param}}}'
        return match.group(0)
    
    new_content = re.sub(param_pattern, replace_usage, new_content)

# Write back
with open('src/lib/email-notifications.ts', 'w') as f:
    f.write(new_content)

print("Email templates updated!")
