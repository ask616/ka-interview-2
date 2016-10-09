const estreeNodes = require('./estree-nodes');
const nodes = estreeNodes.ids;

module.exports = {
  supportedNodes: [
    nodes.ReturnStatement,
    nodes.BreakStatement,
    nodes.ContinueStatement,
    nodes.IfStatement,
    nodes.SwitchStatement,
    nodes.WhileStatement,
    nodes.DoWhileStatement,
    nodes.ForStatement,
    nodes.ForInStatement,
    nodes.ThrowStatement,
    nodes.TryStatement,
    nodes.FunctionDeclaration,
    nodes.VariableDeclaration,
    nodes.BinaryExpression,
    nodes.UpdateExpression,
    nodes.AssignmentExpression,
    nodes.LogicalExpression,
    nodes.ConditionalExpression,
    nodes.CallExpression,
    nodes.NewExpression,
    nodes.ArrowFunctionExpression,
    nodes.YieldExpression,
    nodes.ClassDeclaration,
    nodes.MethodDefinition,
    nodes.ImportDeclaration,
  ],

  getSupportedNodesDisplay() {
    return this.supportedNodes.map(id => ({ id, display: estreeNodes.display[id] }));
  },
};
