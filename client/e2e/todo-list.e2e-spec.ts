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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000000;
  });

  it('should get and highlight Todos title attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });


  it('should type something in filter owner box and check that the correct amount of elements were returned',() => {
    page.typeAOwner('bla')
    page.getTodos().then(todos => {
      expect(todos.length).toBe(43);
    });

    for (let i = 0; i < 4; i++) {
      page.backspace();
    }

    page.typeAOwner('fry')
    page.getTodos().then(todos => {
      expect(todos.length).toBe(61);
    });

    for (let i = 0; i < 3; i++) {
      page.backspace();
    }

    page.typeAOwner('v')
    page.getTodos().then(todos => {
      expect(todos.length).toBe(0);
    });
  });

  /// THESE TESTS DO GET THE CORRECT ID AND MATCH THE VALUES, THEY JUST DON'T KNOW WHEN TO STOP??? SO WE GET ASYNC ERRORS
  it('should type something in filter owner box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeAOwner('b');
    expect(page.getUniqueTodo('58af3a600343927e48e87216')).toEqual('Blanche');
    expect(page.getUniqueTodo('58af3a600343927e48e8721c')).toEqual('Barry');
    expect(page.getUniqueTodo('58af3a600343927e48e87220')).toEqual('Roberta');

    page.backspace();
    page.typeAOwner('fry');
    expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
  });

  it('should type something in filter body box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeABody('est');
    expect(page.getUniqueTodo('58af3a600343927e48e87218')).toEqual('Workman');
    expect(page.getUniqueTodo('58af3a600343927e48e8721e')).toEqual('Blanche');
    expect(page.getUniqueTodo('58af3a600343927e48e87223')).toEqual('Fry');

    for (let i = 0; i < 3; i++) {
      page.backspace();
    }

    page.typeABody('veniam');
    expect(page.getUniqueTodo('58af3a600343927e48e8721d')).toEqual('Dawn');
  });

});
