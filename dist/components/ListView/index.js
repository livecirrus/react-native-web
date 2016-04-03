'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _NativeMethodsDecorator = require('../../modules/NativeMethodsDecorator');

var _NativeMethodsDecorator2 = _interopRequireDefault(_NativeMethodsDecorator);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScrollView = require('../ScrollView');

var _ScrollView2 = _interopRequireDefault(_ScrollView);

var _ListViewDataSource = require('./ListViewDataSource');

var _ListViewDataSource2 = _interopRequireDefault(_ListViewDataSource);

var _ListViewPropTypes = require('./ListViewPropTypes');

var _ListViewPropTypes2 = _interopRequireDefault(_ListViewPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCROLLVIEW_REF = 'listviewscroll';

var ListView = (0, _NativeMethodsDecorator2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(ListView, _Component);

  function ListView(props) {
    _classCallCheck(this, ListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ListView).call(this, props));

    _this.state = {
      curRenderedRowsCount: _this.props.initialListSize,
      highlightedRow: {}
    };
    _this.onRowHighlighted = function (sectionId, rowId) {
      return _this._onRowHighlighted(sectionId, rowId);
    };
    return _this;
  }

  _createClass(ListView, [{
    key: 'getScrollResponder',
    value: function getScrollResponder() {
      return this.refs[SCROLLVIEW_REF] && this.refs[SCROLLVIEW_REF].getScrollResponder();
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo() {
      var _refs$SCROLLVIEW_REF;

      return this.refs[SCROLLVIEW_REF] && (_refs$SCROLLVIEW_REF = this.refs[SCROLLVIEW_REF]).scrollTo.apply(_refs$SCROLLVIEW_REF, arguments);
    }
  }, {
    key: 'setNativeProps',
    value: function setNativeProps(props) {
      return this.refs[SCROLLVIEW_REF] && this.refs[SCROLLVIEW_REF].setNativeProps(props);
    }
  }, {
    key: '_onRowHighlighted',
    value: function _onRowHighlighted(sectionId, rowId) {
      this.setState({ highlightedRow: { sectionId: sectionId, rowId: rowId } });
    }
  }, {
    key: 'render',
    value: function render() {
      var dataSource = this.props.dataSource;
      // console.log('whoop')
      var header = this.props.renderHeader ? this.props.renderHeader() : undefined;
      var footer = this.props.renderFooter ? this.props.renderFooter() : undefined;

      // render sections and rows
      var children = [];
      var sections = dataSource.rowIdentities;
      var renderRow = this.props.renderRow;
      var renderSectionHeader = this.props.renderSectionHeader;
      var renderSeparator = this.props.renderSeparator;
      for (var sectionIdx = 0, sectionCnt = sections.length; sectionIdx < sectionCnt; sectionIdx++) {
        var rows = sections[sectionIdx];
        var sectionId = dataSource.sectionIdentities[sectionIdx];

        // render optional section header
        if (renderSectionHeader) {
          var section = dataSource.getSectionHeaderData(sectionIdx);
          var key = 's_' + sectionId;
          var child = _react2.default.createElement(
            'div',
            { key: key },
            renderSectionHeader(section, sectionId)
          );
          children.push(child);
        }

        // render rows
        for (var rowIdx = 0, rowCnt = rows.length; rowIdx < rowCnt; rowIdx++) {
          var rowId = rows[rowIdx];
          var row = dataSource.getRowData(sectionIdx, rowIdx);
          var _key = 'r_' + sectionId + '_' + rowId;
          var _child = _react2.default.createElement(
            'div',
            { key: _key },
            renderRow(row, sectionId, rowId, this.onRowHighlighted)
          );
          children.push(_child);

          // render optional separator
          if (renderSeparator && (rowIdx !== rows.length - 1 || sectionIdx === sections.length - 1)) {
            var adjacentRowHighlighted = this.state.highlightedRow.sectionID === sectionId && (this.state.highlightedRow.rowID === rowId || this.state.highlightedRow.rowID === rows[rowIdx + 1]);
            var separator = renderSeparator(sectionId, rowId, adjacentRowHighlighted);
            children.push(separator);
          }
        }
      }

      var _props = this.props;
      var renderScrollComponent = _props.renderScrollComponent;

      var props = _objectWithoutProperties(_props, ['renderScrollComponent']);

      return _react2.default.cloneElement(renderScrollComponent(props), {
        ref: SCROLLVIEW_REF
      }, header, children, footer);
    }
  }]);

  return ListView;
}(_react.Component), _class2.DataSource = _ListViewDataSource2.default, _class2.propTypes = _ListViewPropTypes2.default, _class2.defaultProps = {
  initialListSize: 10,
  pageSize: 1,
  renderScrollComponent: function renderScrollComponent(props) {
    return _react2.default.createElement(_ScrollView2.default, props);
  },
  scrollRenderAheadDistance: 1000,
  onEndReachedThreshold: 1000,
  stickyHeaderIndices: []
}, _temp)) || _class;

exports.default = ListView;


module.exports = ListView;