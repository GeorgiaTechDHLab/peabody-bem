tinymce.init({
  selector: 'h2.editable',
  inline: true,
  toolbar: 'undo redo',
  menubar: false
});

tinymce.init({
  selector: 'div.editable',
  inline: true,
  menu: {
    edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
    insert: {title: 'Insert', items: 'link media | template hr'},
    format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
  },
  plugins: [
    'advlist autolink lists link image charmap anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media contextmenu paste'
  ],
  toolbar: 'insertfile undo redo | styleselect | bullist numlist outdent indent'
});