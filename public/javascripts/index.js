$(document).ready(() => {
  const editor = initializeProblemEditor();

  let callTimer;
  const delay = 3000;

  /**
   * Event handler for ACE editor interaction. We maintain a timeout that will
   * make the API call 3 seconds after the user stops typing. If typing is resumed
   * before that time, the timeout is stopped and replaced.
   */
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

  /**
   * Updates error bar after a validation API call
   */
  function updateErrors(response) {
    const { whitelistViolations, blacklistViolations, structureViolation } = response;
    const numErrors = whitelistViolations.length + blacklistViolations.length + (structureViolation
      ? 1 : 0);
    const successBg = 'mdl-color--teal-400';
    const errorBg = 'mdl-color--red-900';

    if (response.success) {
      if (numErrors > 0) {
        $('#errors-status').html(buildErrorHtml(whitelistViolations,
          blacklistViolations, structureViolation, numErrors));
        $('.errors-card').removeClass(successBg).addClass(errorBg);
      } else {
        $('#errors-status').html('There are no issues!');
        $('.errors-card').removeClass(errorBg).addClass(successBg);
      }
    }
  }

  function buildErrorHtml(whitelistViolations, blacklistViolations, structureViolation, numErrors) {
    let errorHtml = '';

    if (numErrors === 1) {
      errorHtml += `There is ${numErrors} issue.`;
    } else if (numErrors > 1) {
      errorHtml += `There are ${numErrors} issues.`;
    }

    errorHtml += '<ul>';

    whitelistViolations.forEach((violation) => {
      errorHtml += `<li>You are missing a ${violation.toLowerCase()}</li>`;
    });

    blacklistViolations.forEach((violation) => {
      errorHtml += `<li>You cannot use a ${violation.toLowerCase()}</li>`;
    });

    if (structureViolation) {
      errorHtml += '<li>The structure of your program is invalid</li>';
    }

    errorHtml += '</ul>';
    return errorHtml;
  }

  /**
   * Gets code and problem ID and makes an AJAX request to our server for code verification
   * @return {[type]} [description]
   */
  function validateCode() {
    const data = {
      code: editor.getValue(),
      id: $('#editor-card').data('id'),
    };

    $.ajax({
      url: '/validate',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: updateErrors,
      error: (error) => { alert(error); },
    });
  }
});
