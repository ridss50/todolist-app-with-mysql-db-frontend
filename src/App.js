import React, { Component } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Table,
} from "react-bootstrap";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      records: [],
      showAlert: false,
      alertMsg: "",
      alertType: "success",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentWillMount() {
    this.fetchAllRecords();
  }

  //add new record
  addRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");

    var body = JSON.stringify({ name: this.state.name });
    fetch("http://localhost:8000/api/create", {
      method: "POST",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          name: "",
          showAlert: true,
          alertMsg: result.response,
          alertType: "success",
        });
      });
  };

  //fetch all records
  fetchAllRecords = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch("http://localhost:8000/api/view", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        this.setState({
          records: result.response,
        });
      })
      .catch((error) => console.log("error", error));
  };

  // view single data to edit
  editRecord = (id) => {
    fetch("http://localhost:8000/api/view/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          id: id,
          update: true,
          name: result.response[0].name,
        });
      })
      .catch((error) => console.log("error", error));
  };

  updateRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({
      id: this.state.id,
      name: this.state.name,
      location: this.state.location,
    });
    fetch("http://localhost:8000/api/update", {
      method: "PUT",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "success",
          update: false,
          id: "",
          name: "",
        });
        this.fetchAllRecords();
      })
      .catch((error) => console.log("error", error));
  };

  // delete a record
  deleteRecord = (id) => {
    fetch("http://localhost:8000/api/delete/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "danger",
        });
        this.fetchAllRecords();
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div className="App">
        <Container>
          {this.state.showAlert === true ? (
            <Alert
              variant={this.state.alertType}
              onClose={() => {
                this.setState({
                  showAlert: false,
                });
              }}
              dismissible
            >
              <Alert.Heading>{this.state.alertMsg}</Alert.Heading>
            </Alert>
          ) : null}
          <Row>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.records.map((record) => {
                  return (
                    <tr>
                      <td>{record.id}</td>
                      <td>{record.name}</td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => this.editRecord(record.id)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => this.deleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Form>
              <FormGroup>
                <FormLabel>Enter Name</FormLabel>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  onChange={this.handleChange}
                  value={this.state.name}
                ></FormControl>
              </FormGroup>
              {this.state.update === true ? (
                <Button onClick={this.updateRecord}>update</Button>
              ) : (
                <Button onClick={this.addRecord}>Save</Button>
              )}
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
