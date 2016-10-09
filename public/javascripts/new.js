$(document).ready(() => {
  const editor = initializeEditor();
  initializeTree();

  /**
   * Event handler for the whitelist/blacklist checkboxes. When an element is selected
   * in one list, we don't want it to be in the other as well, so we disable it
   */
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

  /**
   * Event handler for the problem submission form
   */
  $('.submit-problem-btn').click(() => {
    const problemText = editor.value();

    if (!problemText.length) {
      alert('You must type your problem first!');
      return;
    }

    const getId = (index, elem) => $(elem).data('id');
    const whitelist = $('*[data-type="whitelist"]:checked').map(getId).toArray();
    const blacklist = $('*[data-type="blacklist"]:checked').map(getId).toArray();

    const treeOptions = {
      no_state: true,
      no_id: true,
      no_data: true,
      no_li_attr: true,
      no_a_attr: true,
    };

    // Get data from JSTree instance
    const structureData = getTreeInstance().get_json(undefined, treeOptions);

    const data = {
      display: problemText,
      whitelist,
      blacklist,
      structureData,
    };

    submitProblem(data, () => {
      $(location).attr('href', '/');
    }, (error) => {
      alert(JSON.stringify(error));
    });
  });

  $('.tree-btn').click((e) => {
    $target = $(e.target);
    addChildNode($target.text().trim(), $target.data('id'));
  });

  function initializeEditor() {
    return new SimpleMDE({
      element: $('#problem-input')[0],
      spellChecker: false,
      toolbar: ['bold', 'italic', 'heading', '|', 'unordered-list', 'ordered-list',
                '|', 'code', 'link', 'image', '|', 'preview', 'guide'],
    });
  }

  /**
   * Initialized the JSTree. I spent over an hour trying to programmatically allow users to modify
   * the structure of the tree, but kept experiencing some issue. As a result, I've hardcoded upon
   * the initialization a basic code structure to be enforced.
   */
  function initializeTree() {
    const tree = $('#tree').jstree({
      core: {
        data: [{
          text: 'Program',
          type: 'Program',
          state: { opened: true, selected: true },
          check_callback: true,
          children: [
            {
              text: 'Function declaration',
              type: 'FunctionDeclaration',
              children: [
                {
                  text: 'For loop',
                  type: 'ForStatement',
                  children: [
                    {
                      text: 'If statement',
                      type: 'IfStatement',
                    },
                  ],
                },
                {
                  text: 'Return statement',
                  type: 'ReturnStatement',
                },
              ],
            },
            {
              text: 'Call expression',
              type: 'CallExpression',
            },
          ],
        }],
      },
      types: {
        default: {
          icon: 'fa fa-code',
          valid_children: ['default', '#'],
        },
        Program: {
          icon: 'fa fa-code',
          valid_children: ['default', 'Program', '#'],
        },
        ReturnStatement: {
          icon: 'fa fa-code',
        },
        BreakStatement: {
          icon: 'fa fa-code',
        },
        ContinueStatement: {
          icon: 'fa fa-code',
        },
        IfStatement: {
          icon: 'fa fa-code',
        },
        SwitchStatement: {
          icon: 'fa fa-code',
        },
        SwitchCase: {
          icon: 'fa fa-code',
        },
        WhileStatement: {
          icon: 'fa fa-code',
        },
        DoWhileStatement: {
          icon: 'fa fa-code',
        },
        ForStatement: {
          icon: 'fa fa-code',
        },
        ForInStatement: {
          icon: 'fa fa-code',
        },
        ThrowStatement: {
          icon: 'fa fa-code',
        },
        TryStatement: {
          icon: 'fa fa-code',
        },
        CatchClause: {
          icon: 'fa fa-code',
        },
        FunctionDeclaration: {
          icon: 'fa fa-code',
        },
        VariableDeclaration: {
          icon: 'fa fa-code',
        },
        BinaryExpression: {
          icon: 'fa fa-code',
        },
        UpdateExpression: {
          icon: 'fa fa-code',
        },
        AssignmentExpression: {
          icon: 'fa fa-code',
        },
        LogicalExpression: {
          icon: 'fa fa-code',
        },
        ConditionalExpression: {
          icon: 'fa fa-code',
        },
        CallExpression: {
          icon: 'fa fa-code',
        },
        NewExpression: {
          icon: 'fa fa-code',
        },
        ArrowFunctionExpression: {
          icon: 'fa fa-code',
        },
        YieldExpression: {
          icon: 'fa fa-code',
        },
        ClassDeclaration: {
          icon: 'fa fa-code',
        },
        MethodDefinition: {
          icon: 'fa fa-code',
        },
        ImportDeclaration: {
          icon: 'fa fa-code',
        },
      },
      plugins: ['types'],
    });
  }

  function getTreeInstance() {
    return $('#tree').jstree(true);
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

  function addChildNode(name, type) {
    const jstree = getTreeInstance();
    const currSelected = jstree.get_selected[0];

    const data = {
      text: name,
      type,
    };

    const newNode = jstree.create_node(currSelected, data);
    return newNode;
  }
});
