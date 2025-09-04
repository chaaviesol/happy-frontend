import { useState, useEffect } from "react";
import AWS from "aws-sdk";

const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(-1);
  const [upload, setUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [links, setLinks] = useState([]);
  const [folder, setFolder] = useState(false);

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_NAME },
    region: process.env.REACT_APP_S3_REGION,
  });

  const uploadFile = (file) => {
    const folderName = folder ? "po_docs" : "prod_images";
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const milliseconds = currentDate.getMilliseconds();

    const file_prefix = ` ${year}${month + 1}${day}${hours}${minutes}${seconds}${milliseconds}`;
    const fileName = file_prefix + selectedFile[index]?.name;
    const params = {
      Body: selectedFile[index],
      Bucket: process.env.REACT_APP_S3_NAME,
      Key: `${folderName}/${fileName}`,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) {
          console.log(err);
        } else {
          let url = myBucket.getSignedUrl("getObject", {
            Bucket: params.Bucket,
            Key: params.Key,
          });
          url = url.split("?")[0];
          console.log("urlll>>>", url);
          if (url) {
            setLinks((prev) => [...prev, url]);
          }
        }
      });
  };

  useEffect(() => {
    if (selectedFile.length > 0 && upload === true) {
      uploadFile();
      setUpload(false);
    }
  }, [selectedFile, upload]);

  return {
    selectedFile,
    setSelectedFile,
    setUpload,
    index,
    setLinks,
    setIndex,
    links,
    folder,
    setFolder
  };
};

export default useFileUpload;
