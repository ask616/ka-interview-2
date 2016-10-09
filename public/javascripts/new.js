$(document).ready(() => {
  const editor = initializeEditor();

  $(':checkbox').change((e) => {
    const $target = $(e.target);
    const isWhitelist = $target.data('type') === 'whitelist';
    const otherListId = isWhitelist ? 'blacklist' : 'whitelist';

    if ($target.is(':checked')) {
      // Enable the opposite checkbox
      $(`#${otherListId}-${$target.data('id')}-component`).get(0).MaterialCheckbox.disable();
    } else {
      // Disable the opposite checkbox
      $(`#${otherListId}-${$target.data('id')}-component`).get(0).MaterialCheckbox.enable();
    }
  });

  $('.submit-problem-btn').click(() => {
    const problemText = editor.value();
    const getId = (index, elem) => $(elem).data('id');
    const whitelist = $('*[data-type="whitelist"]:checked').map(getId).toArray();
    const blacklist = $('*[data-type="blacklist"]:checked').map(getId).toArray();

    const data = {
      display: problemText,
      whitelist,
      blacklist,
    };

    submitProblem(data, () => {
      alert('Succeeded!');
    }, (error) => {
      alert(error);
    });
  });

  function initializeEditor() {
    return new SimpleMDE({
      element: $('#problem-input')[0],
      spellChecker: false,
      toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list',
                '|', 'code', 'link', 'image', '|', 'preview', 'guide'],
    });
  }

  function submitProblem(data, onSuccess, onError) {
    $.ajax({
      url: '/new',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: onSuccess,
      error: onError,
    });
  }
});
