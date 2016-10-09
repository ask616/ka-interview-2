$(document).ready(() => {
  new SimpleMDE({
    element: $('#problem-input')[0],
    spellChecker: false,
    toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list',
              '|', 'code', 'link', 'image', '|', 'preview', 'guide'],
  });

  new SimpleMDE({
    element: $('#solution-input')[0],
    spellChecker: false,
    toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list',
              '|', 'code', 'link', 'image', '|', 'preview', 'guide'],
  });
});
