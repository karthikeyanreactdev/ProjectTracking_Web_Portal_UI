import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Container, Jumbotron, Button, Row, Col, Modal } from 'react-bootstrap';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham-dark.css';
import Projects from './Projects';
import { connect } from 'react-redux';
import { getAllprojects } from '../store/Action/projectAction';
import apiRoot from '../ApiPath';


class AdminPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modules: AllCommunityModules,
			show: false,
			openalert: false,
			id: '',
			overlayNoRowsTemplate:
				'<div class="ag-overlay-loading-top text-center"><p>No Records Found  </p><div class="loaderr"></div></div></div>',
			overlayLoadingTemplate:
				'<div class="ag-overlay-loading-top text-center mt-4"><p>Please wait while loading</p><div class="loader5"></div></div></div>',

			columnDefs: [
				{ headerName: 'Project Name', field: 'projectname', sortable: true, width: 150, sortingOrder: ['asc', 'desc'], },
				{
					headerName: 'Start Date', field: 'startdate', sortable: true, width: 150, sortingOrder: ['asc', 'desc'],
					cellRenderer(params) {
						const date = new Date(params.data.startdate).toLocaleDateString('en-US', {
							year: 'numeric',
							day: '2-digit',
							month: '2-digit'
						});
						return date;
					}
				},
				{
					headerName: 'End Date', field: 'enddate', sortable: true, width: 150, sortingOrder: ['asc', 'desc'],
					cellRenderer(params) {
						if (params.data.enddate !== null) {
							const date = new Date(params.data.enddate).toLocaleDateString('en-US', {
								year: 'numeric',
								day: '2-digit',
								month: '2-digit'
							});
							return date;
						} else {
							return null
						}
					}
				},
				{ headerName: 'Status', field: 'status', sortable: true, width: 150, sortingOrder: ['asc', 'desc'], },
				{
					headerName: 'Edit',
					field: 'icon',
					width: 35,
					cellRenderer: params => {
						const link = document.createElement('i');
						link.innerHTML = '<i class="fa fa-pencil fa-1x"></i>';
						link.title = 'Click here to edit the project';

						link.addEventListener('click', e => {
							e.preventDefault();
								this.setState({
								id: params.data.id,
								show: true
							})
						});
						return link;
					}
				},
				{
					headerName: 'Delete',
					field: 'icon',
					width: 35,
					cellRenderer: params => {
						const link = document.createElement('i');
						link.title = 'Click here to delete the project';
						link.innerHTML = '<i class="fa fa-trash-o fa-1x"></i>';
						link.addEventListener('click', e => {
							e.preventDefault();

							this.setState({
								id: params.data.id,
								openalert: true
							})

						});
						return link;
					}
				},
			],

			defaultColDef: {
				resizable: true,
				domLayout: 'autoHeight'
			},
			rowData: [],
			paginationPageSize: 25

		}

	};
	componentDidMount() {
		this.props.getAllprojects();

	

	};
	componentWillReceiveProps(nextProps) {
		
		this.setState({
			rowData: nextProps.allprojects
		})
	}
	
// ag-grid init function
	onGridReady = params => {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.gridApi.showLoadingOverlay();

		this.gridApi.sizeColumnsToFit();
		//this.gridColumnApi.autoSizeAllColumns();
		// window.onresize = () => {
		// 	this.gridApi.sizeColumnsToFit();
		// };
		const gridWidth = document.getElementById('myGrid').offsetWidth;

		if (gridWidth < 500) {
			const allColIds = this.gridColumnApi.getAllColumns().map(column => column.colId);
			this.gridColumnApi.autoSizeColumns(allColIds);

			// If you want to resize all columns
			this.gridColumnApi.autoSizeAllColumns();
		}

		this.gridApi.setDomLayout('autoHeight');
		document.querySelector('#myGrid').style.height = '';

	};
// this function open  add/update dialog box
	handleShow = () => {
		this.setState({
			show: true
		})

	}
// this function closes  add/update dialog box
	handleClose = () => {
		this.props.getAllprojects();

		this.setState({
			show: false,
			id: ''

		})
	}

// this function closes confirm dialog
	closeConfirm = () => {
		this.setState({
			openalert: false,
			id: ''
		})
	}

// this function delete project from DB
	handledelete = () => {
		const { id } = this.state;

		if (id) {
			axios
				.delete(`${apiRoot.url}/delete/${id}`)
				.then(response => response.data)
				.then(
					result => {
						this.closeConfirm()
						const beforedelete = _.cloneDeep(this.state.rowData);
						const projectid = this.state.rowData.find(f => f.id === id);
						const index = beforedelete.indexOf(projectid);
						beforedelete.splice(index, 1);
						this.setState({ rowData: beforedelete });
					},
					err => {
						console.log(err);
					}
				);
		}
		
	};
	render() {

		const { show, id, openalert } = this.state;
		return (
			<div>
				<Container bsPrefix="nc">

					<Jumbotron className="mt-4">
						<Row >
							<Col xs={4} sm={4} md={4} lg={4} xl={4}>
								<h4 className="m=0">Projects</h4>
							</Col>
							<Col xs={8} sm={8} md={8} lg={8} xl={8}>
								<Button variant="outline-primary" className="float-right" onClick={this.handleShow}>Add Project</Button>
							</Col>
						</Row>
						<div style={{ height: 'calc(100% - 25px)', clear: 'both', marginTop: '10px' }}>
							<div
								id="myGrid"
								style={{
									height: '100%',
									width: '100%'
								}}
								className="ag-theme-balham"
							>

								<AgGridReact
									modules={this.state.modules}
									columnDefs={this.state.columnDefs}
									defaultColDef={this.state.defaultColDef}
									overlayLoadingTemplate={this.state.overlayLoadingTemplate}
									overlayNoRowsTemplate={this.state.overlayNoRowsTemplate}
									onGridReady={this.onGridReady}
									rowData={this.state.rowData}
									pagination
									paginationPageSize={this.state.paginationPageSize}
									domLayout={this.state.domLayout}
								/>
							</div>
						</div>
					</Jumbotron>
				</Container>


				{/* handles add and update project */}
				<Modal show={show} onHide={this.handleClose} centered>
					<Modal.Header closebutton>
						<Modal.Title>{id === '' ? 'Add' : 'Update'}</Modal.Title>
					</Modal.Header>
					<Modal.Body><Projects id={id}  close={this.handleClose} /></Modal.Body>

				</Modal>


				{/* handles delete alert */}
				<Modal show={openalert} onHide={this.closeConfirm} centered>
					<Modal.Header closebutton className="delete">
						<Modal.Title>Confirmation</Modal.Title>
					</Modal.Header>
					<Modal.Body>Are you sure want to delete ? </Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handledelete}>Ok</Button>
						<Button variant="primary" onClick={this.closeConfirm}>Cancel</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	allprojects: state.Projects
})

export default connect(mapStateToProps, { getAllprojects })(AdminPage);