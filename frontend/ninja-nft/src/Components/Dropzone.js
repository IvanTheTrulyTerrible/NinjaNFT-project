import React from 'react';
import { useDropzone } from 'react-dropzone';
import styled from "styled-components";

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
  }
  
  const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
  `;

export default function Dropzone({ onDropAccepted, accept, open }) {

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
          },
        maxFiles:1,
        onDropAccepted,
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

  return (
    <div className="container">
      <Container {...getRootProps({isFocused, isDragAccept, isDragActive, isDragReject})}>
        <input {...getInputProps()} />
        {isDragActive ? (
            <p className="dropzone-content">
              Release to drop the files here
            </p>
          ) : (
            <p className="dropzone-content">
              Drag’ n’ drop some files here, or click to select files
            </p>
        )}
      </Container>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
      </aside>
    </div>
  );
}