import { TiTick } from "react-icons/ti";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import './AdminViewUser.css'
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import AdminNavbar from "./AdminNavbar";

function AdminViewUsers() {
  return (
    <div>
    <AdminNavbar/>
    <div className="container mt-5 pt-5" style={{minHeight:"100vh"}}>
    <div >
    <div className='row'>
                <div className='col'>
                    <h4>All Users</h4>
                </div>
                <div className='col '>
                    <Form className="searchbar1">
                        <Form.Control
                            type="search"
                            placeholder="Search Here... "
                            aria-label="Search"

                        /> </Form>
                </div>
            </div>
            <div id='AdminViewUserTableFull'>
                <Table  id='AdminViewUserTable'>
                    <tr>
                        <th className='AdminViewUserTableHeader'>S No</th>
                        <th className='AdminViewUserTableHeader'>Profile Picture</th>
                        <th className='AdminViewUserTableHeader'>Name</th>
                        <th className='AdminViewUserTableHeader'>Email id</th>
                        <th className='AdminViewUserTableHeader'>Phone Number</th>
                        <th className='AdminViewUserTableHeader'>Action</th>
                    </tr>
                    <tr>
                        <td className='AdminViewUserTableData'>1.</td>
                        <td className='AdminViewUserTableData'>image</td>
                        <td className='AdminViewUserTableData'>Akhila </td>
                        <td className='AdminViewUserTableData'>akhila123@gmail.com</td>
                        <td className='AdminViewUserTableData'>9995558882</td>
                        <td className='AdminViewUserTableData'><Button className='rounded-pill'>Active <TiTick /></Button></td>
                    </tr>
                    <tr>
                        <td className='AdminViewUserTableData'>2.</td>
                        <td className='AdminViewUserTableData'>image</td>
                        <td className='AdminViewUserTableData'>Rahul </td>
                        <td className='AdminViewUserTableData'>rahul123@gmail.com</td>
                        <td className='AdminViewUserTableData'>9995558888</td>
                        <td className='AdminViewUserTableData'><Button className='rounded-pill'>Active <TiTick /></Button></td>
                    </tr>
                    <tr>
                        <td className='AdminViewUserTableData'>3.</td>
                        <td className='AdminViewUserTableData'>image</td>
                        <td className='AdminViewUserTableData'>Vimal </td>
                        <td className='AdminViewUserTableData'>vimal@gmail.com</td>
                        <td className='AdminViewUserTableData'>8995558882</td>
                        <td className='AdminViewUserTableData'><Button className='rounded-pill'>Active <TiTick /></Button></td>
                    </tr>
                   
                    
                    </Table>
            </div>
            </div>

</div>
<div className="landing_sec_5">
<FooterLandingPage />
</div>    </div>
  )
}

export default AdminViewUsers
