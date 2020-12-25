import React, {useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {fileUpload} from "../redux/actions/register/documents";

import '../assets/css/documents.css';
const baseStyle = {
    outline: 'none',
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function StyledDropzone(props){
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('selectedFile', file);

        fileUpload(formData).then((res) => {
            props.func(res.data.results, file.name);
        }).catch((err) => {
            props.func('Format');
        })
    }, [props]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return (
        <div className="upload-customize">
            <div>{props.title}</div>
            <div className="txt-14 col-white upload-p" {...getRootProps({style})}>
                <input {...getInputProps()} />
                <CloudUploadIcon style={{fontSize: 64}}/>
                <div className="btn-fileUpload txt-14 col-white justify-center">Upload</div>
            </div>
        </div>
    );
}
