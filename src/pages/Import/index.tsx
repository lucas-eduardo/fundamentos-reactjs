import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    data.append('file', uploadedFiles[uploadedFiles.length - 1].file);

    try {
      await api.post('/transactions/import', data);
      history.goBack();
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const file = files[files.length - 1];

    const fileIndex = uploadedFiles.findIndex(
      (item) => item.name === file.name,
    );

    if (fileIndex === -1) {
      setUploadedFiles([
        ...uploadedFiles,
        {
          file,
          name: file.name,
          readableSize: filesize(file.size),
        },
      ]);
    } else {
      uploadedFiles[fileIndex] = {
        file,
        name: file.name,
        readableSize: filesize(file.size),
      };

      setUploadedFiles(uploadedFiles);
    }
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
