# API Documentation

## Base URL
http://localhost:3001

## Policy Routes

### Create Policy
- **POST** `http://localhost:3001/api/policies/`
- Creates a new policy
- Requires policy data in request body
- Reference schema: 

### Read Policies
- **GET** `http://localhost:3001/api/policies/`
  - Retrieves all policies

- **GET** `http://localhost:3001/api/policies/:id`
  - Retrieves a single policy by MongoDB id

- **GET** `http://localhost:3001/api/policies/policy/:policyId`
  - Retrieves a single policy by policyId

### Update Policy
- **PUT** `http://localhost:3001/api/policies/:id`
  - Updates a policy by MongoDB id
  - Requires updated policy data in request body

- **PUT** `http://localhost:3001/api/policies/policy/:policyId`
  - Updates a policy by policyId
  - Requires updated policy data in request body

### Delete Policy
- **DELETE** `http://localhost:3001/api/policies/:id`
  - Deletes a policy by MongoDB id

- **DELETE** `http://localhost:3001/api/policies/policy/:policyId`
  - Deletes a policy by policyId
  - Also removes policy reference from user's policies array

## User Routes

### Create User
- **POST** `http://localhost:3001/api/users/`
- Creates a new user
- Requires user data in request body
- Reference schema:

### Read Users
- **GET** `http://localhost:3001/api/users/`
  - Retrieves all users with populated policy data

- **GET** `http://localhost:3001/api/users/user/:userId`
  - Retrieves a single user by userId with populated policy data

### Update User
- **PUT** `http://localhost:3001/api/users/user/:userId`
  - Updates a user by userId
  - Requires updated user data in request body

### Delete User
- **DELETE** `http://localhost:3001/api/users/user/:userId`
  - Deletes a user by userId
  - Also removes user references from policies (policyOwners and attestationResponsiblePersons)

## Sample Data Format

### Policy Example

```json
{
  "userId": "Test1",
  "policyId": "Policy1",
  "policyName": "Information Security Policy",
  "policyCategory": "Security",
  "policyEffectiveDate": "2024-03-21T00:00:00.000Z",
  "policyOwners": [],
  "requiresReview": true,
  "approvalWorkflowId": "",
  "attestationResponsiblePersons": [],
  "attestationRequiresESignature": true,
  "attestationFrequencyType": "monthly",
  "attestationFrequencyInterval": 1,
  "editLink": "",
  "readLink": ""
}
```

### User Example
```json
{
  "name": "Test User 1",
  "userId": "Test1",
  "email": "test1@company.com",
  "role": "Policy Administrator",
  "organizationId": "TestOrg1",
  "organizationName": "Test Org 1",
  "policies": []
}
```

The routes are defined in these files:
