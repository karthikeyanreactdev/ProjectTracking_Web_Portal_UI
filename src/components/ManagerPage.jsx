import React, { Component } from 'react';
import axios from 'axios';
import { Container, Jumbotron } from 'react-bootstrap';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham-dark.css';
import { connect } from 'react-redux';
import { getAllprojects } from '../store/Action/projectAction';
import apiRoot from '../ApiPath';

class ManagerPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modules: AllCommunityModules, overlayNoRowsTemplate:
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
				{
					headerName: 'Status', field: 'status', sortable: true, width: 150, sortingOrder: ['asc', 'desc'],

					cellRenderer: params => {
						const link = document.createElement('div');
						link.style.cursor = 'pointer';
						link.innerHTML =
							params.data.status === 'InComplete'
								? '<Button class="incomplete" variant="primary" >In Complete</Button>'
								: '<Button class="completed" variant="primary">Completed</Button>';
						link.addEventListener('click', e => {
							e.preventDefault();
							const id = params.data.id

							if (params.data.status === 'Completed') {
								params.data.status = 'InComplete';
								this.updateStatus(id, 'InComplete');

							} else if (params.data.status === 'InComplete') {
								params.data.status = 'Completed';
								this.updateStatus(id, 'Completed');
							}
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
			paginationPageSize: 25,
			rowHeight: 35

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


	// updates project status in DB
	updateStatus = (id, status) => {

		let params = {
			id: id,
			status: status
		}

		axios
			.post(`${apiRoot.url}/updatestatus`, params)
			.then(response => response.data)
			.then(
				result => {
					this.props.getAllprojects();
					this.gridApi.redrawRows();
				},
				err => {
					console.log(err);
				}
			)

	}
	// eslint-disable-next-line no-undef
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

	render() {


		return (
			<div>
				<Container bsPrefix="nc">

					<Jumbotron className="mt-4">
						<h4>Projects</h4>
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
									rowHeight={this.state.rowHeight}
									pagination
									paginationPageSize={this.state.paginationPageSize}
									domLayout={this.state.domLayout}
								/>
							</div>
						</div>
					</Jumbotron>
				</Container>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	allprojects: state.Projects
})

export default connect(mapStateToProps, { getAllprojects })(ManagerPage);
