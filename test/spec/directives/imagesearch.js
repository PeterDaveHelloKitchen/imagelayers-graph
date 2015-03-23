'use strict';

describe('Directive: imageSearch', function () {
  // load the directive's module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('views/imageSearch.html'));

  var element,
      controller,
      directive,
      registryService,
      deferredTag,
      scope;

  beforeEach(inject(function ($q, $compile, $rootScope, _registryService_) {
    var rootScope = $rootScope.$new(),
       autoElem = angular.element("<div mass-autocomplete><section image-search model='model'></section></div>");

    directive = $compile(autoElem)(rootScope);
    rootScope.$digest();

    element = autoElem.find('[image-search]');
    scope = element.isolateScope();
    controller = element.controller('imageSearch');

    registryService = _registryService_;
    deferredTag = $q.defer();
    spyOn(registryService, 'fetchTags').and.returnValue(deferredTag.promise);
    deferredTag.resolve({});

    rootScope.model = {'name': 'foo', 'tag': '1.0.0'};
  }));

  it('should initialize tagList', function() {

    expect(scope.tagList.length).toEqual(0);
  });

  it('should initialize autocomplete_options', function() {
    expect(scope.autocomplete_options).toEqual(
      {
        'suggest': jasmine.any(Function),
        'on_error': jasmine.any(Function),
        'on_attach': jasmine.any(Function),
        'on_select': jasmine.any(Function)
      });
  });

  describe('suggestImages', function() {
    beforeEach(inject(function($q) {
      var deferredSuccess = $q.defer();
      spyOn(registryService, 'search').and.returnValue(deferredSuccess.promise);
      deferredSuccess.resolve({ data: { results: [{ name: 'foo' },{ name: 'bar' }] } });
    }));

    it('should return empty array when term size < 3', function() {
      var list = scope.suggestImages('me');
      expect(list.length).toEqual(0);
    });

    it('calls registryService.search when term > 2', function() {
      var list = scope.suggestImages('term');
      expect(registryService.search).toHaveBeenCalledWith('term');
    });
  });

  describe('$watch model', function() {
    it('should fetchTags when model changes', function() {
      scope.model = { name: 'blah' };
      scope.$digest();
      expect(registryService.fetchTags).toHaveBeenCalled();
    });
  });
});
