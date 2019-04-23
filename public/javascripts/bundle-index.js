/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var dateComponent = Vue.extend({
  props: ['current_date'],
  methods: {
    changeDate: function changeDate(direction) {
      this.$emit('change-date', direction);
    }
  },
  template: '<section class="date">\n               <div class="holder">\n                 <div class="block today">\n                   <div class="ui-component" v-on:click="changeDate(0)">\u672C\u65E5</div>\n                 </div>\n                 <div class="block present">\n                   <div class="holder">\n                     <div class="nav prev" v-on:click="changeDate(-1)"> \n                       <i class="fas fa-chevron-left fa-lg"></i>\n                     </div>\n                     <div class="text">\n                       <span class="num">{{current_date.year}}</span>\n                       <span class="unit">\u5E74</span>\n                       <span class="num">{{current_date.month}}</span>\n                       <span class="unit">\u6708</span>\n                       <span class="num">{{current_date.day}}</span>\n                       <span class="unit">\u65E5</span>\n                       <span class="unit">(</span>\n                       <span class="dayofweek">{{current_date.dayOfWeekString}}</span>\n                       <span class="unit">)</span>\n                     </div>\n                     <div class="nav next" v-on:click="changeDate(1)">\n                       <i class="fas fa-chevron-right fa-lg"></i>\n                     </div>\n                   </div>\n                 </div>\n                 <div class="block select">\n                   <i class="fas fa-calendar-alt fa-2x"></i>\n                 </div>\n               </div>\n             </section>'
});

var modalComponent = Vue.extend({
  props: ['period_data', 'modal_visibility'],
  methods: {
    clearModal: function clearModal() {
      this.$emit('clear-modal');
    }
  },
  template: '<transition>\n               <div class="overlay" v-show="modal_visibility" v-on:click.self="clearModal">\n                 <div class="modal">\n                   <div class="panel">\n                     <div class="section cancel">\n                       <div class="message">\n                         <h1>\u4E88\u7D04\u5185\u5BB9</h1>\n                         <div class="information">\n                           <div class="office">\n                             <div class="head">\u65BD\u8A2D\u540D</div>\n                             <div class="body">{{period_data.officename}}</div>\n                           </div>\n                           <div class="space">\n                             <div class="head">\u90E8\u5C4B</div>\n                             <div class="body">{{period_data.spacename}}</div>\n                           </div>\n                           <div class="date">\n                             <div class="head">\u65E5\u6642</div>\n                             <div class="body">{{period_data.year}}\u5E74 {{period_data.month}}\u6708 {{period_data.day}}\u65E5({{period_data.dayofweek}}) {{period_data.periodname}}</div>\n                           </div>\n                           <div class="name">\n                             <div class="head">\u304A\u540D\u524D</div>\n                             <div class="body">{{period_data.guestname}}</div>\n                           </div>\n                         </div>\n                       </div>\n                       <div class="nav-holder">\n                         <div class="btn-holder">\n                           <div class="btn-close ui-component" v-on:click="clearModal">\u9589\u3058\u308B</div>\n                         </div>\n                         <div class="btn-holder">\n                           <a class="ui-component confirm" v-bind:href="\'/reserve/cancel/\' + period_data.reservationId">\u4E88\u7D04\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3059\u308B</a>\n                         </div>\n                       </div>\n                     </div>\n                   </div>\n                   <div class="close" v-on:click="clearModal"></div>\n                 </div>\n               </div>\n             </transition>'
});

var spaceComponent = Vue.extend({
  props: ['space', 'current_date'],
  methods: {
    showModal: function showModal(period) {
      this.$emit('show-modal', period);
    }
  },
  template: '<li class="space clearfix">\n                    <div class="information clearfix">\n                      <div class="name">{{space.spacename}}</div>\n                      <div class="capacity">\n                        \u6700\u5927<span>{{space.capacity}}</span>\u540D\n                      </div>\n                    </div>\n                    <div class="reservation">\n                      <div class="period" v-for="period in space.periods" v-bind:key="period.num">\n                        <div class="time">{{period.periodname}}</div>\n                        <a v-if="period.availability"\n                           class="status available"\n                           key="reserve-available"\n                           v-bind:href="\'/reserve/space/\' + space.spaceId + \'/period/\' + period.num + \'/year/\' + current_date.year + \'/month/\' + current_date.month + \'/day/\' + current_date.day"\n                        >\n                           &#9675;\n                        </a>\n                        <div v-else-if="period.isSelf"\n                          class="status unavailable nav-detail"\n                          key="reserve-is-self"\n                          v-on:click="showModal(period)"\n                        >\n                          \u4E88\u7D04\u6E08\n                        </div>\n                        <div v-else\n                          class="status unavailable"\n                          key="reserve-not-available"\n                        >\n                          &#10005;\n                        </div>\n                      </div>\n                    </div>\n                  </li>'
});

var officeComponent = Vue.extend({
  props: ['office', 'spaces', 'current_date'],
  data: function data() {
    return {
      showImg: false
    };
  },
  components: {
    'space-component': spaceComponent
  },
  methods: {
    showModal: function showModal(period) {
      this.$emit('show-modal', period);
    }
  },
  template: '<div class="box">\n              <div class="information">\n                <div class="photo"><img v-bind:src="office.imgPath" v-on:load="showImg=true" v-bind:class="{hide: !showImg}" class="responsive-img"></div>\n                <div class="name">{{office.officename}}</div>\n              </div>\n              <div class="data">\n                <ul class="space-list">\n                  <space-component v-for="space in spaces" v-bind:key="space.spaceId" v-bind:space="space" v-bind:current_date="current_date" v-on:show-modal="showModal"></space-component>\n                </ul>\n              </div>\n            </div>'
});

var app = new Vue({
  el: '#app',
  components: {
    'office-component': officeComponent,
    'date-component': dateComponent,
    'modal-component': modalComponent
  },
  data: {
    currentDate: {},
    offices: [],
    officeSpaceObject: {},
    periodData: {},
    modal_visibility: false
  },
  created: function created() {
    var uri = window.location.href.split('?');
    if (uri.length == 2) {
      var vars = uri[1].split('&');
      var getVars = {};
      var tmp = '';
      vars.forEach(function (v) {
        tmp = v.split('=');
        if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
      });
      this.currentDate.year = Number(getVars.year);
      this.currentDate.month = Number(getVars.month);
      this.currentDate.day = Number(getVars.day);
    }
  },
  mounted: function mounted() {
    var _this = this;

    var url = '/dateOfCurrentDay';
    if (this.currentDate.year && this.currentDate.month && this.currentDate.day) {
      var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + this.currentDate.day;
      url += parameter;
    }
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (data) {
      _this.currentDate = data.currentDate;
      _this.offices = data.offices;
      _this.officeSpaceObject = data.officeSpaceObject;
    });
  },

  methods: {
    showModal: function showModal(period) {
      this.modal_visibility = true;
      this.periodData = period;
    },
    clearModal: function clearModal() {
      this.modal_visibility = false;
    },
    changeDate: function changeDate(direction) {
      var _this2 = this;

      var url = '/dateOfCurrentDay';
      if (direction !== 0) {
        var day = Number(this.currentDate.day) + direction;
        var parameter = '?year=' + this.currentDate.year + '&month=' + this.currentDate.month + '&day=' + day;
        url += parameter;
      }
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.currentDate = data.currentDate;
        _this2.offices = data.offices;
        _this2.officeSpaceObject = data.officeSpaceObject;
      });
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["Headers"] = Headers;
/* harmony export (immutable) */ __webpack_exports__["Request"] = Request;
/* harmony export (immutable) */ __webpack_exports__["Response"] = Response;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOMException", function() { return DOMException; });
/* harmony export (immutable) */ __webpack_exports__["fetch"] = fetch;
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = 'statusText' in options ? options.statusText : 'OK'
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = self.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      resolve(new Response(body, options))
    }

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'))
    }

    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob'
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    })

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!self.fetch) {
  self.fetch = fetch
  self.Headers = Headers
  self.Request = Request
  self.Response = Response
}


/***/ })
/******/ ]);