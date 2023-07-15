import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

function EditorBase({ content, setContent }) {
    const onChange = (e) => {
        setContent(e.target.getContent());
    };

    return (
        <Editor
            value={content}
            apiKey=""
            onChange={onChange}
            init={{
                // height: heightApp || windowSize.heightApp,
                menubar: true,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                    'formatselect | bold italic backcolor forecolor | link image |\
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | code table | removeformat | fullscreen  preview save print help',
                // toolbar:
                //     'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                image_title: true,
                /* enable automatic uploads of images represented by blob or data URIs*/
                automatic_uploads: true,
                /*
                  URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                  images_upload_url: 'postAcceptor.php',
                  here we add custom filepicker only to Image dialog
                */
                fullscreen_native: true,
                file_picker_callback: function (cb, value, meta) {
                    try {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');

                        /*
                            Note: In modern browsers input[type="file"] is functional without
                            even adding it to the DOM, but that might not be the case in some older
                            or quirky browsers like IE, so you might want to add it to the DOM
                            just in case, and visually hide it. And do not forget do remove it
                            once you do not need it anymore.
                        */

                        input.onchange = function () {
                            var file = this.files[0];

                            var reader = new FileReader();
                            reader.onload = function () {
                                /*
                                    Note: Now we need to register the blob in TinyMCEs image blob
                                    registry. In the next release this part hopefully won't be
                                    necessary, as we are looking to handle it internally.
                                */
                                var id = 'blobid' + new Date().getTime();
                                var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                                var base64 = reader.result.split(',')[1];
                                var blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);

                                /* call the callback and populate the Title field with the file name */
                                cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                        };

                        input.click();
                    } catch (e) {}
                },
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
        />
    );
}

EditorBase.propTypes = {
    content: PropTypes.string,
    setContent: PropTypes.func,
};

EditorBase.defaultProps = {
    content: '',
    setContent: () => {},
};

export default React.memo(EditorBase);
