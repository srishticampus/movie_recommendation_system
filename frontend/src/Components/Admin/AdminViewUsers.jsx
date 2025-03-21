import { TiTick } from "react-icons/ti";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { getAllUsers, activateUser, deactivateUser } from "../../Services/apiService";
import "./AdminViewUser.css";
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import AdminNavbar from "./AdminNavbar";
import DefaultProfileImage from "../../assets/blank-profile-picture-973460_1280.webp"; // Import the default image

function AdminViewUsers() {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store errors

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        if (response.success) {
          setUsers(response.data); // Update state with fetched users
        } else {
          throw new Error("Failed to fetch users.");
        }
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUsers();
  }, []);

  // Handle user activation
  const handleActivateUser = async (userId) => {
    try {
      const response = await activateUser(userId);
      if (response.success) {
        // Update the user's status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_active: true } : user
          )
        );
        alert("User activated successfully.");
      } else {
        throw new Error("Failed to activate user.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle user deactivation
  const handleDeactivateUser = async (userId) => {
    try {
      const response = await deactivateUser(userId);
      if (response.success) {
        // Update the user's status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_active: false } : user
          )
        );
        alert("User deactivated successfully.");
      } else {
        throw new Error("Failed to deactivate user.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Render loading or error state
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 pt-5" style={{ minHeight: "100vh" }}>
        <div>
          <div className="row">
            <div className="col">
              <h4>All Users</h4>
            </div>
            <div className="col">
              <Form className="searchbar1">
                <Form.Control
                  type="search"
                  placeholder="Search Here..."
                  aria-label="Search"
                />
              </Form>
            </div>
          </div>
          <div id="AdminViewUserTableFull">
            <Table id="AdminViewUserTable">
              <thead>
                <tr>
                  <th className="AdminViewUserTableHeader">S No</th>
                  <th className="AdminViewUserTableHeader">Profile Picture</th>
                  <th className="AdminViewUserTableHeader">Name</th>
                  <th className="AdminViewUserTableHeader">Email ID</th>
                  <th className="AdminViewUserTableHeader">Phone Number</th>
                  <th className="AdminViewUserTableHeader">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="AdminViewUserTableData">{index + 1}</td>
                    <td className="AdminViewUserTableData">
                      <img
                        src={
                          user.profile_pic
                            ? `${import.meta.env.VITE_API_URL}${user.profile_pic}`
                            : DefaultProfileImage // Use the default image if profile_pic is null
                        }
                        alt="Profile"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    </td>
                    <td className="AdminViewUserTableData">{user.full_name}</td>
                    <td className="AdminViewUserTableData">{user.email}</td>
                    <td className="AdminViewUserTableData">{user.phone_number || "N/A"}</td>
                    <td className="AdminViewUserTableData">
                      {user.is_active ? (
                        <Button
                          variant="danger"
                          className="rounded-pill"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          className="rounded-pill"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          Activate <TiTick />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="landing_sec_5">
        <FooterLandingPage />
      </div>
    </div>
  );
}

export default AdminViewUsers;