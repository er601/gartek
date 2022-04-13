import React, {useState} from "react";
import {BASE_URL} from "../../common/requester";
import {Modal} from "antd";

export const FileLink = ({record}) => {
    const [showFile, setShowFile] = useState(false);

    if (!record) return null;

    let {file: {fileName, fullFileName}} = record;

    const ar = fileName.split('.');
    if (ar.length < 2) return null;
    const ext = ar[1].substring(0, 3);
    // const url = `${BASE_URL}file/doc/${id}`;
    const url = `${BASE_URL}attachment/download/${fullFileName}`;
    const downloadHandler = () => {
        let link = document.createElement('a');
        link.href = url;
        link.click();
        URL.revokeObjectURL(link.href);
    };
    const getFileExt = (name) => {
        let spl = name.split('.');
        return spl[spl.length - 1];
    };
    const clickHandler = (e) => {
        if (['jpg', 'jpeg', 'bmp', 'gif', 'jfif', 'png', 'pgm', 'pnm', 'ppm'].includes(getFileExt(fileName))) {
            e.preventDefault();
            e.stopPropagation();
            setShowFile(true);
        }
    };

    return <>
        <span className={`fiv-sqo fiv-icon-${ext}`}/>
        &nbsp;&nbsp;<a href={url} onClick={clickHandler} target="_blank" download={fileName}>{fileName}</a>
        {showFile && <Modal visible={showFile} title={<h4>Название: {fileName}</h4>} width={"65%"}
                            onOk={downloadHandler} okText={'Скачать'} okButtonProps={{icon: 'download'}}
                            onCancel={() => setShowFile(false)} cancelText={'Закрыть'}>
            <img src={url} alt={fileName} width={"100%"} height={"auto"}/>
        </Modal>}
    </>
};