import axios from 'axios';
import apiRoot from '../../ApiPath';
//actions
export const getAll = 'getAll';

// action creator
export const getAllprojects = () => async dispatch => {

    await axios.get(`${apiRoot.url}/getall`)
        .then(response => response.data)
        .then(
            result => {

                dispatch({
                    type: getAll,
                    payload: result.data
                });
            },
            err => {
                dispatch({
                    type: getAll,
                    payload: []
                });

            }
        );
}
