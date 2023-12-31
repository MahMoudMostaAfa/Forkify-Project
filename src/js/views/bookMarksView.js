import View from './view';
import icons from '../../img/icons.svg';
import previewView from './previewView';
class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks found';
  _SucessMessage = '';
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  //   _generateMarkupPreview(result) {
  //     const id = window.location.hash.slice(1);
  //     return ` <li class="preview">
  //     <a class="preview__link ${
  //       id === result.id ? 'preview__link--active' : ''
  //     } " href="#${result.id}">
  //       <figure class="preview__fig">
  //         <img src="${result.image}" alt="Test" />
  //       </figure>
  //       <div class="preview__data">
  //         <h4 class="preview__title">${result.title}</h4>
  //         <p class="preview__publisher">${result.publisher}</p>
  //       </div>
  //     </a>
  //   </li>`;
  //   }
}
export default new BookMarksView();
