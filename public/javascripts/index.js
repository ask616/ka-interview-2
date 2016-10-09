$(document).ready(() => {
  const editor = initializeProblemEditor();

  let callTimer;
  const delay = 3000;

  editor.on('change', (e) => {
    if (callTimer) {
      clearTimeout(callTimer);
    }

    if (editor.getValue().length) {
      callTimer = setTimeout(validateCode, delay);
    }
  });

  function initializeProblemEditor() {
    const editorInstance = ace.edit('editor');
    editorInstance.setTheme('ace/theme/github');
    editorInstance.getSession().setMode('ace/mode/javascript');
    return editorInstance;
  }

  function alertValidation() {
    console.log('validated');
  }

  function validateCode() {
    const data = {
      code: editor.getValue(),
      id: $('#editor-card').data('id'),
    };
    console.log(data.id);
    // $.ajax({
    //   url: '/validate',
    //   type: 'GET',
    //   data: JSON.stringify({ code: editor.getValue() }),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   success: alertValidation,
    //   error: (error) => { alert(error); },
    // });
  }
});
