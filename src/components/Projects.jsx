import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import apiRoot from '../ApiPath';


function Projects(props) {

    const [validated, setValidated] = useState(false);
    const [projectName, setprojectName] = useState("");
    const [id, setid] = useState("");
    useEffect(() => {
       
        if (props.id !== '') {
            axios
                .get(`${apiRoot.url}/getbyid/${props.id}`)
                .then(response => response.data)
                .then(
                    result => {
                        setprojectName(result.data.projectname)
                        setid(result.data.id)
                    },
                    err => {
                        console.log(err);
                    }
                );

        }

    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;


        if (form.checkValidity() === false) {
            event.preventDefault();
            // event.stopPropagation();


            setValidated(true)
        }
        else {
            if (validated) {

                if (props.id !== '') {

                    update();
                } else {
                    add();
                }
            }
        }
    }

    const add = () => {
        let params = {
            projectName: projectName
        }

        axios
            .post(`${apiRoot.url}/create`, params)
            .then(response => response.data)
            .then(
                result => {
                    props.close()
                },
                err => {
                    console.log(err);
                }
            )
    }
    const update = () => {
        let params = {
            id: id,
            projectName: projectName
        }

        axios
            .post(`${apiRoot.url}/update`, params)
            .then(response => response.data)
            .then(
                result => {
                    props.close()
                },
                err => {
                    console.log(err);
                }
            )
    }

    return (
        <div>
            <Container bsPrefix="nc" >



                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <Form.Row className="justify-content-center">
                        <Form.Group as={Col} md="10" controlId="validationCustom01">
                            {/* <Form.Label>Project Name</Form.Label> */}
                            <Form.Control
                                required
                                type="text"
                                name="projectName"
                                placeholder="Project Name"
                                onChange={(e) => { setValidated(true); setprojectName(e.target.value) }}
                                defaultValue={projectName}
                            />
                            <Row className="justify-content-center">
                                <Button variant="primary" type="submit" className="col-3 m-2">{props.id !== '' ? 'Update' : 'Save'}</Button>
                                <Button variant="primary" type="button" onClick={props.close} className="col-3 m-2">Close</Button>
                            </Row>
                        </Form.Group>
                    </Form.Row>
                </Form>

            </Container>
        </div>
    )

}

export default Projects