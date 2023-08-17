import View from './view';
import icons from '../../img/icons.svg';
import previewView from './previewView';
class ResultsView extends View {
  _errorMessage = 'No Recipes Found';
  _SucessMessage = '';

  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
