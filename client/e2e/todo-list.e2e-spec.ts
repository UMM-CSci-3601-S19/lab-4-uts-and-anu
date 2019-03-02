import {TodoPage} from "./todo-list.po";
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';


const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('should get and highlight Todos title attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('should type something in filter owner box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeAOwner('b');
    expect(page.getUniqueTodo('In sunt')).toEqual('Kitty Page');
    page.backspace();
    page.typeAOwner('fry');
    expect(page.getUniqueTodo('Veniam ut ex sit voluptate Lorem')).toEqual('Lynn Ferguson');
  });

}
