//for fetching data from backEnd
import axios from "axios";

export function getLocations(filters ={}){
    return axios.get('/api/landmarks', {params:filters});
}

export function getLandmark(id){
    return axios.get('/api/landmarks/' + id);
}

export function newLandmark(data){
    return axios.post('/api/landmarks',data)
}

export function updateLandmark(id,data){
    return axios.put('/api/landmarks/'+id,data)
}

export function deleteLandmark(id){
    return axios.delete('/api/landmarks/'+id)
}

export function updateFavourite(id){
    return axios.patch('/api/landmarks/'+id+'/favourite'); 
}