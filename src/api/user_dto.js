//user_dto.js
//this file contains the schema for the Data Transfer Object (DTO) 
// that we will use when getting/setting user data like username, email, bio, interests etc.

const UserDTO = {
    id: null,
    username: '',
    email: '',
    bio: '',
    verified: Boolean,
}

module.exports = {UserDTO};