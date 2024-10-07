// HELPER TO GET ALL USERS
import { getAllUsers } from '../../service/users_db';

export default async function handler(req, res) {
  const allUsers = await getAllUsers();
  res.status(200).json(allUsers);
}
