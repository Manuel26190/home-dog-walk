var Tp = Object.defineProperty,
  Ap = Object.defineProperties;
var Np = Object.getOwnPropertyDescriptors;
var sc = Object.getOwnPropertySymbols;
var Op = Object.prototype.hasOwnProperty,
  Rp = Object.prototype.propertyIsEnumerable;
var ac = (t, e, r) =>
    e in t
      ? Tp(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) Op.call(e, r) && ac(t, r, e[r]);
    if (sc) for (var r of sc(e)) Rp.call(e, r) && ac(t, r, e[r]);
    return t;
  },
  j = (t, e) => Ap(t, Np(e));
var uc = null;
var Bo = 1;
function de(t) {
  let e = uc;
  return (uc = t), e;
}
var cc = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Fp(t) {
  if (!(zo(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Bo)) {
    if (!t.producerMustRecompute(t) && !Uo(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Bo);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Bo);
  }
}
function lc(t) {
  return t && (t.nextProducerIndex = 0), de(t);
}
function dc(t, e) {
  if (
    (de(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (zo(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        Ho(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Uo(t) {
  kr(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Fp(r), n !== r.version)) return !0;
  }
  return !1;
}
function fc(t) {
  if ((kr(t), zo(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Ho(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Ho(t, e) {
  if ((Pp(t), kr(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      Ho(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    kr(i), (i.producerIndexOfThis[n] = e);
  }
}
function zo(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function kr(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function Pp(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function kp() {
  throw new Error();
}
var Lp = kp;
function hc(t) {
  Lp = t;
}
function I(t) {
  return typeof t == "function";
}
function Zt(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Lr = Zt(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function jn(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var Q = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (I(n))
        try {
          n();
        } catch (o) {
          e = o instanceof Lr ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            pc(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Lr ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Lr(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) pc(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && jn(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && jn(r, e), e instanceof t && e._removeParent(this);
  }
};
Q.EMPTY = (() => {
  let t = new Q();
  return (t.closed = !0), t;
})();
var Go = Q.EMPTY;
function Vr(t) {
  return (
    t instanceof Q ||
    (t && "closed" in t && I(t.remove) && I(t.add) && I(t.unsubscribe))
  );
}
function pc(t) {
  I(t) ? t() : t.unsubscribe();
}
var Te = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Yt = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = Yt;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = Yt;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function jr(t) {
  Yt.setTimeout(() => {
    let { onUnhandledError: e } = Te;
    if (e) e(t);
    else throw t;
  });
}
function $n() {}
var gc = (() => Wo("C", void 0, void 0))();
function mc(t) {
  return Wo("E", void 0, t);
}
function vc(t) {
  return Wo("N", t, void 0);
}
function Wo(t, e, r) {
  return { kind: t, value: e, error: r };
}
var _t = null;
function Qt(t) {
  if (Te.useDeprecatedSynchronousErrorHandling) {
    let e = !_t;
    if ((e && (_t = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = _t;
      if (((_t = null), r)) throw n;
    }
  } else t();
}
function yc(t) {
  Te.useDeprecatedSynchronousErrorHandling &&
    _t &&
    ((_t.errorThrown = !0), (_t.error = t));
}
var St = class extends Q {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Vr(e) && e.add(this))
          : (this.destination = $p);
    }
    static create(e, r, n) {
      return new Kt(e, r, n);
    }
    next(e) {
      this.isStopped ? Zo(vc(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Zo(mc(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Zo(gc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Vp = Function.prototype.bind;
function qo(t, e) {
  return Vp.call(t, e);
}
var Yo = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          $r(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          $r(n);
        }
      else $r(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          $r(r);
        }
    }
  },
  Kt = class extends St {
    constructor(e, r, n) {
      super();
      let i;
      if (I(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Te.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && qo(e.next, o),
              error: e.error && qo(e.error, o),
              complete: e.complete && qo(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Yo(i);
    }
  };
function $r(t) {
  Te.useDeprecatedSynchronousErrorHandling ? yc(t) : jr(t);
}
function jp(t) {
  throw t;
}
function Zo(t, e) {
  let { onStoppedNotification: r } = Te;
  r && Yt.setTimeout(() => r(t, e));
}
var $p = { closed: !0, next: $n, error: jp, complete: $n };
var Jt = (() =>
  (typeof Symbol == "function" && Symbol.observable) || "@@observable")();
function fe(t) {
  return t;
}
function Qo(...t) {
  return Ko(t);
}
function Ko(t) {
  return t.length === 0
    ? fe
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var P = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = Up(r) ? r : new Kt(r, n, i);
      return (
        Qt(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Dc(n)),
        new n((i, o) => {
          let s = new Kt({
            next: (a) => {
              try {
                r(a);
              } catch (u) {
                o(u), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [Jt]() {
      return this;
    }
    pipe(...r) {
      return Ko(r)(this);
    }
    toPromise(r) {
      return (
        (r = Dc(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Dc(t) {
  var e;
  return (e = t ?? Te.Promise) !== null && e !== void 0 ? e : Promise;
}
function Bp(t) {
  return t && I(t.next) && I(t.error) && I(t.complete);
}
function Up(t) {
  return (t && t instanceof St) || (Bp(t) && Vr(t));
}
function Jo(t) {
  return I(t?.lift);
}
function O(t) {
  return (e) => {
    if (Jo(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function T(t, e, r, n, i) {
  return new Xo(t, e, r, n, i);
}
var Xo = class extends St {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (u) {
              e.error(u);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (u) {
              e.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Xt() {
  return O((t, e) => {
    let r = null;
    t._refCount++;
    let n = T(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var en = class extends P {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Jo(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new Q();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          T(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = Q.EMPTY));
    }
    return e;
  }
  refCount() {
    return Xt()(this);
  }
};
var Cc = Zt(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var he = (() => {
    class t extends P {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Br(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Cc();
      }
      next(r) {
        Qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        Qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        Qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? Go
          : ((this.currentObservers = null),
            o.push(r),
            new Q(() => {
              (this.currentObservers = null), jn(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new P();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Br(e, r)), t;
  })(),
  Br = class extends he {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : Go;
    }
  };
var X = class extends he {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var ve = new P((t) => t.complete());
function wc(t) {
  return t && I(t.schedule);
}
function Ec(t) {
  return t[t.length - 1];
}
function Ur(t) {
  return I(Ec(t)) ? t.pop() : void 0;
}
function st(t) {
  return wc(Ec(t)) ? t.pop() : void 0;
}
function bc(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        c(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? o(l.value) : i(l.value).then(a, u);
    }
    c((n = n.apply(t, e || [])).next());
  });
}
function Ic(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function xt(t) {
  return this instanceof xt ? ((this.v = t), this) : new xt(t);
}
function Mc(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (h) {
        return new Promise(function (m, R) {
          o.push([f, h, m, R]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      u(n[f](h));
    } catch (m) {
      d(o[0][3], m);
    }
  }
  function u(f) {
    f.value instanceof xt
      ? Promise.resolve(f.value.v).then(c, l)
      : d(o[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function _c(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof Ic == "function" ? Ic(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = t[o](s)), i(a, u, s.done, s.value);
        });
      };
  }
  function i(o, s, a, u) {
    Promise.resolve(u).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var Hr = (t) => t && typeof t.length == "number" && typeof t != "function";
function zr(t) {
  return I(t?.then);
}
function Gr(t) {
  return I(t[Jt]);
}
function Wr(t) {
  return Symbol.asyncIterator && I(t?.[Symbol.asyncIterator]);
}
function qr(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Hp() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Zr = Hp();
function Yr(t) {
  return I(t?.[Zr]);
}
function Qr(t) {
  return Mc(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield xt(r.read());
        if (i) return yield xt(void 0);
        yield yield xt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Kr(t) {
  return I(t?.getReader);
}
function Z(t) {
  if (t instanceof P) return t;
  if (t != null) {
    if (Gr(t)) return zp(t);
    if (Hr(t)) return Gp(t);
    if (zr(t)) return Wp(t);
    if (Wr(t)) return Sc(t);
    if (Yr(t)) return qp(t);
    if (Kr(t)) return Zp(t);
  }
  throw qr(t);
}
function zp(t) {
  return new P((e) => {
    let r = t[Jt]();
    if (I(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Gp(t) {
  return new P((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Wp(t) {
  return new P((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, jr);
  });
}
function qp(t) {
  return new P((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function Sc(t) {
  return new P((e) => {
    Yp(t, e).catch((r) => e.error(r));
  });
}
function Zp(t) {
  return Sc(Qr(t));
}
function Yp(t, e) {
  var r, n, i, o;
  return bc(this, void 0, void 0, function* () {
    try {
      for (r = _c(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function ue(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function Jr(t, e = 0) {
  return O((r, n) => {
    r.subscribe(
      T(
        n,
        (i) => ue(n, t, () => n.next(i), e),
        () => ue(n, t, () => n.complete(), e),
        (i) => ue(n, t, () => n.error(i), e)
      )
    );
  });
}
function Xr(t, e = 0) {
  return O((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function xc(t, e) {
  return Z(t).pipe(Xr(e), Jr(e));
}
function Tc(t, e) {
  return Z(t).pipe(Xr(e), Jr(e));
}
function Ac(t, e) {
  return new P((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Nc(t, e) {
  return new P((r) => {
    let n;
    return (
      ue(r, e, () => {
        (n = t[Zr]()),
          ue(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => I(n?.return) && n.return()
    );
  });
}
function ei(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new P((r) => {
    ue(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      ue(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Oc(t, e) {
  return ei(Qr(t), e);
}
function Rc(t, e) {
  if (t != null) {
    if (Gr(t)) return xc(t, e);
    if (Hr(t)) return Ac(t, e);
    if (zr(t)) return Tc(t, e);
    if (Wr(t)) return ei(t, e);
    if (Yr(t)) return Nc(t, e);
    if (Kr(t)) return Oc(t, e);
  }
  throw qr(t);
}
function H(t, e) {
  return e ? Rc(t, e) : Z(t);
}
function w(...t) {
  let e = st(t);
  return H(t, e);
}
function tn(t, e) {
  let r = I(t) ? t : () => t,
    n = (i) => i.error(r());
  return new P(e ? (i) => e.schedule(n, 0, i) : n);
}
function es(t) {
  return !!t && (t instanceof P || (I(t.lift) && I(t.subscribe)));
}
var Ke = Zt(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function A(t, e) {
  return O((r, n) => {
    let i = 0;
    r.subscribe(
      T(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: Qp } = Array;
function Kp(t, e) {
  return Qp(e) ? t(...e) : t(e);
}
function ti(t) {
  return A((e) => Kp(t, e));
}
var { isArray: Jp } = Array,
  { getPrototypeOf: Xp, prototype: eg, keys: tg } = Object;
function ni(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Jp(e)) return { args: e, keys: null };
    if (ng(e)) {
      let r = tg(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function ng(t) {
  return t && typeof t == "object" && Xp(t) === eg;
}
function ri(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function Bn(...t) {
  let e = st(t),
    r = Ur(t),
    { args: n, keys: i } = ni(t);
  if (n.length === 0) return H([], e);
  let o = new P(rg(n, e, i ? (s) => ri(i, s) : fe));
  return r ? o.pipe(ti(r)) : o;
}
function rg(t, e, r = fe) {
  return (n) => {
    Fc(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let u = 0; u < i; u++)
          Fc(
            e,
            () => {
              let c = H(t[u], e),
                l = !1;
              c.subscribe(
                T(
                  n,
                  (d) => {
                    (o[u] = d), l || ((l = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function Fc(t, e, r) {
  t ? ue(r, t, e) : e();
}
function Pc(t, e, r, n, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && e.complete();
    },
    h = (R) => (c < n ? m(R) : u.push(R)),
    m = (R) => {
      o && e.next(R), c++;
      let q = !1;
      Z(r(R, l++)).subscribe(
        T(
          e,
          (F) => {
            i?.(F), o ? h(F) : e.next(F);
          },
          () => {
            q = !0;
          },
          void 0,
          () => {
            if (q)
              try {
                for (c--; u.length && c < n; ) {
                  let F = u.shift();
                  s ? ue(e, s, () => m(F)) : m(F);
                }
                f();
              } catch (F) {
                e.error(F);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      T(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Y(t, e, r = 1 / 0) {
  return I(e)
    ? Y((n, i) => A((o, s) => e(n, o, i, s))(Z(t(n, i))), r)
    : (typeof e == "number" && (r = e), O((n, i) => Pc(n, i, t, r)));
}
function nn(t = 1 / 0) {
  return Y(fe, t);
}
function kc() {
  return nn(1);
}
function rn(...t) {
  return kc()(H(t, st(t)));
}
function ii(t) {
  return new P((e) => {
    Z(t()).subscribe(e);
  });
}
function ts(...t) {
  let e = Ur(t),
    { args: r, keys: n } = ni(t),
    i = new P((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        Z(r[l]).subscribe(
          T(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || o.next(n ? ri(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(ti(e)) : i;
}
function ye(t, e) {
  return O((r, n) => {
    let i = 0;
    r.subscribe(T(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function at(t) {
  return O((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      T(r, void 0, void 0, (s) => {
        (o = Z(t(s, at(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Lc(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      u = e,
      c = 0;
    o.subscribe(
      T(
        s,
        (l) => {
          let d = c++;
          (u = a ? t(u, l, d) : ((a = !0), l)), n && s.next(u);
        },
        i &&
          (() => {
            a && s.next(u), s.complete();
          })
      )
    );
  };
}
function Tt(t, e) {
  return I(e) ? Y(t, e, 1) : Y(t, 1);
}
function ut(t) {
  return O((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function Je(t) {
  return t <= 0
    ? () => ve
    : O((e, r) => {
        let n = 0;
        e.subscribe(
          T(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function ns(t) {
  return A(() => t);
}
function oi(t = ig) {
  return O((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function ig() {
  return new Ke();
}
function Un(t) {
  return O((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Le(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ye((i, o) => t(i, o, n)) : fe,
      Je(1),
      r ? ut(e) : oi(() => new Ke())
    );
}
function on(t) {
  return t <= 0
    ? () => ve
    : O((e, r) => {
        let n = [];
        e.subscribe(
          T(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function rs(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ye((i, o) => t(i, o, n)) : fe,
      on(1),
      r ? ut(e) : oi(() => new Ke())
    );
}
function is(t, e) {
  return O(Lc(t, e, arguments.length >= 2, !0));
}
function os(...t) {
  let e = st(t);
  return O((r, n) => {
    (e ? rn(t, r, e) : rn(t, r)).subscribe(n);
  });
}
function De(t, e) {
  return O((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      T(
        n,
        (u) => {
          i?.unsubscribe();
          let c = 0,
            l = o++;
          Z(t(u, l)).subscribe(
            (i = T(
              n,
              (d) => n.next(e ? e(u, d, l, c++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function ss(t) {
  return O((e, r) => {
    Z(t).subscribe(T(r, () => r.complete(), $n)), !r.closed && e.subscribe(r);
  });
}
function J(t, e, r) {
  let n = I(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? O((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          T(
            o,
            (u) => {
              var c;
              (c = n.next) === null || c === void 0 || c.call(n, u), o.next(u);
            },
            () => {
              var u;
              (a = !1),
                (u = n.complete) === null || u === void 0 || u.call(n),
                o.complete();
            },
            (u) => {
              var c;
              (a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, u),
                o.error(u);
            },
            () => {
              var u, c;
              a && ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n);
            }
          )
        );
      })
    : fe;
}
function V(t) {
  for (let e in t) if (t[e] === V) return e;
  throw Error("Could not find renamed property on target object.");
}
function si(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function re(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(re).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function Vc(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var og = V({ __forward_ref__: V });
function jt(t) {
  return (
    (t.__forward_ref__ = jt),
    (t.toString = function () {
      return re(this());
    }),
    t
  );
}
function ne(t) {
  return El(t) ? t() : t;
}
function El(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(og) && t.__forward_ref__ === jt
  );
}
function Il(t) {
  return t && !!t.ɵproviders;
}
var bl = "https://g.co/ng/security#xss",
  v = class extends Error {
    constructor(e, r) {
      super(ua(e, r)), (this.code = e);
    }
  };
function ua(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var sg = V({ ɵcmp: V }),
  ag = V({ ɵdir: V }),
  ug = V({ ɵpipe: V }),
  cg = V({ ɵmod: V }),
  mi = V({ ɵfac: V }),
  Hn = V({ __NG_ELEMENT_ID__: V }),
  jc = V({ __NG_ENV_ID__: V });
function Gn(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function lg(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Gn(t);
}
function dg(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new v(-200, `Circular dependency in DI detected for ${t}${r}`);
}
function ca(t, e) {
  throw new v(-201, !1);
}
function fg(t, e) {
  t == null && hg(e, t, null, "!=");
}
function hg(t, e, r, n) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (n == null ? "" : ` [Expected=> ${r} ${n} ${e} <=Actual]`)
  );
}
function y(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function ie(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Vi(t) {
  return $c(t, _l) || $c(t, Sl);
}
function Ml(t) {
  return Vi(t) !== null;
}
function $c(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function pg(t) {
  let e = t && (t[_l] || t[Sl]);
  return e || null;
}
function Bc(t) {
  return t && (t.hasOwnProperty(Uc) || t.hasOwnProperty(gg)) ? t[Uc] : null;
}
var _l = V({ ɵprov: V }),
  Uc = V({ ɵinj: V }),
  Sl = V({ ngInjectableDef: V }),
  gg = V({ ngInjectorDef: V }),
  S = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(S || {}),
  ws;
function xl() {
  return ws;
}
function Ce(t) {
  let e = ws;
  return (ws = t), e;
}
function Tl(t, e, r) {
  let n = Vi(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & S.Optional) return null;
  if (e !== void 0) return e;
  ca(t, "Injector");
}
var pe = globalThis;
var C = class {
  constructor(e, r) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof r == "number"
        ? (this.__NG_ELEMENT_ID__ = r)
        : r !== void 0 &&
          (this.ɵprov = y({
            token: this,
            providedIn: r.providedIn || "root",
            factory: r.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var mg = {},
  Wn = mg,
  Es = "__NG_DI_FLAG__",
  vi = "ngTempTokenPath",
  vg = "ngTokenPath",
  yg = /\n/gm,
  Dg = "\u0275",
  Hc = "__source",
  ln;
function Cg() {
  return ln;
}
function ct(t) {
  let e = ln;
  return (ln = t), e;
}
function wg(t, e = S.Default) {
  if (ln === void 0) throw new v(-203, !1);
  return ln === null
    ? Tl(t, void 0, e)
    : ln.get(t, e & S.Optional ? null : void 0, e);
}
function D(t, e = S.Default) {
  return (xl() || wg)(ne(t), e);
}
function p(t, e = S.Default) {
  return D(t, ji(e));
}
function ji(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Is(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = ne(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new v(900, !1);
      let i,
        o = S.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          u = Eg(a);
        typeof u == "number" ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a);
      }
      e.push(D(i, o));
    } else e.push(D(n));
  }
  return e;
}
function Al(t, e) {
  return (t[Es] = e), (t.prototype[Es] = e), t;
}
function Eg(t) {
  return t[Es];
}
function Ig(t, e, r, n) {
  let i = t[vi];
  throw (
    (e[Hc] && i.unshift(e[Hc]),
    (t.message = bg(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[vg] = i),
    (t[vi] = null),
    t)
  );
}
function bg(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Dg
      ? t.slice(2)
      : t;
  let i = re(e);
  if (Array.isArray(e)) i = e.map(re).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : re(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    yg,
    `
  `
  )}`;
}
function ir(t) {
  return { toString: t }.toString();
}
var Nl = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Nl || {}),
  $e = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })($e || {}),
  fn = {},
  we = [];
function Ol(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function bs(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      _g(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function Mg(t) {
  return t === 3 || t === 4 || t === 6;
}
function _g(t) {
  return t.charCodeAt(0) === 64;
}
function qn(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? zc(t, r, i, null, e[++n])
              : zc(t, r, i, null, null));
      }
    }
  return t;
}
function zc(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var Rl = "ng-template";
function Sg(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == "string" && i) {
      let s = t[n++];
      if (r && o === "class" && Ol(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function Fl(t) {
  return t.type === 4 && t.value !== Rl;
}
function xg(t, e, r) {
  let n = t.type === 4 && !r ? Rl : t.value;
  return e === n;
}
function Tg(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = Og(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let u = e[a];
    if (typeof u == "number") {
      if (!s && !Ae(n) && !Ae(u)) return !1;
      if (s && Ae(u)) continue;
      (s = !1), (n = u | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (u !== "" && !xg(t, u, r)) || (u === "" && e.length === 1))
        ) {
          if (Ae(n)) return !1;
          s = !0;
        }
      } else {
        let c = n & 8 ? u : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!Sg(t.attrs, c, r)) {
            if (Ae(n)) return !1;
            s = !0;
          }
          continue;
        }
        let l = n & 8 ? "class" : u,
          d = Ag(l, i, Fl(t), r);
        if (d === -1) {
          if (Ae(n)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let f;
          d > o ? (f = "") : (f = i[d + 1].toLowerCase());
          let h = n & 8 ? f : null;
          if ((h && Ol(h, c, 0) !== -1) || (n & 2 && c !== f)) {
            if (Ae(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Ae(n) || s;
}
function Ae(t) {
  return (t & 1) === 0;
}
function Ag(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return Rg(e, t);
}
function Ng(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Tg(t, e[n], r)) return !0;
  return !1;
}
function Og(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (Mg(r)) return e;
  }
  return t.length;
}
function Rg(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function Gc(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function Fg(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !Ae(s) && ((e += Gc(o, i)), (i = "")),
        (n = s),
        (o = o || !Ae(n));
    r++;
  }
  return i !== "" && (e += Gc(o, i)), e;
}
function Pg(t) {
  return t.map(Fg).join(",");
}
function kg(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!Ae(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function ce(t) {
  return ir(() => {
    let e = jl(t),
      r = j(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Nl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || $e.Emulated,
        styles: t.styles || we,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    $l(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = qc(n, !1)), (r.pipeDefs = qc(n, !0)), (r.id = jg(r)), r
    );
  });
}
function Lg(t) {
  return dt(t) || Pl(t);
}
function Vg(t) {
  return t !== null;
}
function oe(t) {
  return ir(() => ({
    type: t.type,
    bootstrap: t.bootstrap || we,
    declarations: t.declarations || we,
    imports: t.imports || we,
    exports: t.exports || we,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Wc(t, e) {
  if (t == null) return fn;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o = i;
      Array.isArray(i) && ((o = i[1]), (i = i[0])), (r[i] = n), e && (e[i] = o);
    }
  return r;
}
function se(t) {
  return ir(() => {
    let e = jl(t);
    return $l(e), e;
  });
}
function dt(t) {
  return t[sg] || null;
}
function Pl(t) {
  return t[ag] || null;
}
function kl(t) {
  return t[ug] || null;
}
function Ll(t) {
  let e = dt(t) || Pl(t) || kl(t);
  return e !== null ? e.standalone : !1;
}
function Vl(t, e) {
  let r = t[cg] || null;
  if (!r && e === !0)
    throw new Error(`Type ${re(t)} does not have '\u0275mod' property.`);
  return r;
}
function jl(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || fn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || we,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Wc(t.inputs, e),
    outputs: Wc(t.outputs),
    debugInfo: null,
  };
}
function $l(t) {
  t.features?.forEach((e) => e(t));
}
function qc(t, e) {
  if (!t) return null;
  let r = e ? kl : Lg;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(Vg);
}
function jg(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483647 + 1), "c" + e;
}
var et = 0,
  N = 1,
  E = 2,
  te = 3,
  Ne = 4,
  Re = 5,
  yi = 6,
  Zn = 7,
  Oe = 8,
  hn = 9,
  Be = 10,
  ee = 11,
  Yn = 12,
  Zc = 13,
  Cn = 14,
  Ue = 15,
  $i = 16,
  sn = 17,
  Qn = 18,
  Bi = 19,
  Bl = 20,
  lt = 21,
  as = 22,
  Ot = 23,
  ft = 25,
  Ul = 1;
var Rt = 7,
  Di = 8,
  Ci = 9,
  Ee = 10,
  la = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(la || {});
function At(t) {
  return Array.isArray(t) && typeof t[Ul] == "object";
}
function tt(t) {
  return Array.isArray(t) && t[Ul] === !0;
}
function Hl(t) {
  return (t.flags & 4) !== 0;
}
function Ui(t) {
  return t.componentOffset > -1;
}
function da(t) {
  return (t.flags & 1) === 1;
}
function ht(t) {
  return !!t.template;
}
function $g(t) {
  return (t[E] & 512) !== 0;
}
function pn(t, e) {
  let r = t.hasOwnProperty(mi);
  return r ? t[mi] : null;
}
var Ms = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function wn() {
  return zl;
}
function zl(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = Ug), Bg;
}
wn.ngInherit = !0;
function Bg() {
  let t = Wl(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === fn) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function Ug(t, e, r, n) {
  let i = this.declaredInputs[r],
    o = Wl(t) || Hg(t, { previous: fn, current: null }),
    s = o.current || (o.current = {}),
    a = o.previous,
    u = a[i];
  (s[i] = new Ms(u && u.currentValue, e, a === fn)), (t[n] = e);
}
var Gl = "__ngSimpleChanges__";
function Wl(t) {
  return t[Gl] || null;
}
function Hg(t, e) {
  return (t[Gl] = e);
}
var Yc = null;
var Ve = function (t, e, r) {
    Yc?.(t, e, r);
  },
  ql = "svg",
  zg = "math",
  Gg = !1;
function Wg() {
  return Gg;
}
function He(t) {
  for (; Array.isArray(t); ) t = t[et];
  return t;
}
function Zl(t, e) {
  return He(e[t]);
}
function Fe(t, e) {
  return He(e[t.index]);
}
function Yl(t, e) {
  return t.data[e];
}
function gt(t, e) {
  let r = e[t];
  return At(r) ? r : r[et];
}
function fa(t) {
  return (t[E] & 128) === 128;
}
function qg(t) {
  return tt(t[te]);
}
function wi(t, e) {
  return e == null ? null : t[e];
}
function Ql(t) {
  t[sn] = 0;
}
function Zg(t) {
  t[E] & 1024 || ((t[E] |= 1024), fa(t) && Kn(t));
}
function Yg(t, e) {
  for (; t > 0; ) (e = e[Cn]), t--;
  return e;
}
function Kl(t) {
  return t[E] & 9216 || t[Ot]?.dirty;
}
function _s(t) {
  Kl(t)
    ? Kn(t)
    : t[E] & 64 &&
      (Wg()
        ? ((t[E] |= 1024), Kn(t))
        : t[Be].changeDetectionScheduler?.notify());
}
function Kn(t) {
  t[Be].changeDetectionScheduler?.notify();
  let e = Jn(t);
  for (; e !== null && !(e[E] & 8192 || ((e[E] |= 8192), !fa(e))); ) e = Jn(e);
}
function Jl(t, e) {
  if ((t[E] & 256) === 256) throw new v(911, !1);
  t[lt] === null && (t[lt] = []), t[lt].push(e);
}
function Qg(t, e) {
  if (t[lt] === null) return;
  let r = t[lt].indexOf(e);
  r !== -1 && t[lt].splice(r, 1);
}
function Jn(t) {
  let e = t[te];
  return tt(e) ? e[te] : e;
}
var x = { lFrame: ad(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Kg() {
  return x.lFrame.elementDepthCount;
}
function Jg() {
  x.lFrame.elementDepthCount++;
}
function Xg() {
  x.lFrame.elementDepthCount--;
}
function Xl() {
  return x.bindingsEnabled;
}
function em() {
  return x.skipHydrationRootTNode !== null;
}
function tm(t) {
  return x.skipHydrationRootTNode === t;
}
function nm() {
  x.skipHydrationRootTNode = null;
}
function B() {
  return x.lFrame.lView;
}
function Pe() {
  return x.lFrame.tView;
}
function Hi(t) {
  return (x.lFrame.contextLView = t), t[Oe];
}
function zi(t) {
  return (x.lFrame.contextLView = null), t;
}
function Ie() {
  let t = ed();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function ed() {
  return x.lFrame.currentTNode;
}
function rm() {
  let t = x.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function or(t, e) {
  let r = x.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function td() {
  return x.lFrame.isParent;
}
function im() {
  x.lFrame.isParent = !1;
}
function om() {
  return x.lFrame.bindingIndex;
}
function sm(t) {
  return (x.lFrame.bindingIndex = t);
}
function nd() {
  return x.lFrame.bindingIndex++;
}
function rd(t) {
  let e = x.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function am() {
  return x.lFrame.inI18n;
}
function um(t, e) {
  let r = x.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Ss(e);
}
function cm() {
  return x.lFrame.currentDirectiveIndex;
}
function Ss(t) {
  x.lFrame.currentDirectiveIndex = t;
}
function lm(t) {
  let e = x.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function id(t) {
  x.lFrame.currentQueryIndex = t;
}
function dm(t) {
  let e = t[N];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Re] : null;
}
function od(t, e, r) {
  if (r & S.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & S.Host); )
      if (((i = dm(o)), i === null || ((o = o[Cn]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (x.lFrame = sd());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function ha(t) {
  let e = sd(),
    r = t[N];
  (x.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function sd() {
  let t = x.lFrame,
    e = t === null ? null : t.child;
  return e === null ? ad(t) : e;
}
function ad(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function ud() {
  let t = x.lFrame;
  return (x.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var cd = ud;
function pa() {
  let t = ud();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function fm(t) {
  return (x.lFrame.contextLView = Yg(t, x.lFrame.contextLView))[Oe];
}
function $t() {
  return x.lFrame.selectedIndex;
}
function Ft(t) {
  x.lFrame.selectedIndex = t;
}
function ld() {
  let t = x.lFrame;
  return Yl(t.tView, t.selectedIndex);
}
function dd() {
  x.lFrame.currentNamespace = ql;
}
function hm() {
  return x.lFrame.currentNamespace;
}
var fd = !0;
function ga() {
  return fd;
}
function ma(t) {
  fd = t;
}
function pm(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = zl(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function va(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      u && (t.viewHooks ??= []).push(-r, u),
      c &&
        ((t.viewHooks ??= []).push(r, c), (t.viewCheckHooks ??= []).push(r, c)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function di(t, e, r) {
  hd(t, e, 3, r);
}
function fi(t, e, r, n) {
  (t[E] & 3) === r && hd(t, e, r, n);
}
function us(t, e) {
  let r = t[E];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[E] = r));
}
function hd(t, e, r, n) {
  let i = n !== void 0 ? t[sn] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let u = i; u < s; u++)
    if (typeof e[u + 1] == "number") {
      if (((a = e[u]), n != null && a >= n)) break;
    } else
      e[u] < 0 && (t[sn] += 65536),
        (a < o || o == -1) &&
          (gm(t, r, e, u), (t[sn] = (t[sn] & 4294901760) + u + 2)),
        u++;
}
function Qc(t, e) {
  Ve(4, t, e);
  let r = de(null);
  try {
    e.call(t);
  } finally {
    de(r), Ve(5, t, e);
  }
}
function gm(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[E] >> 14 < t[sn] >> 16 &&
      (t[E] & 3) === e &&
      ((t[E] += 16384), Qc(a, o))
    : Qc(a, o);
}
var dn = -1,
  Pt = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function mm(t) {
  return t instanceof Pt;
}
function vm(t) {
  return (t.flags & 8) !== 0;
}
function ym(t) {
  return (t.flags & 16) !== 0;
}
function pd(t) {
  return t !== dn;
}
function Ei(t) {
  return t & 32767;
}
function Dm(t) {
  return t >> 16;
}
function Ii(t, e) {
  let r = Dm(t),
    n = e;
  for (; r > 0; ) (n = n[Cn]), r--;
  return n;
}
var xs = !0;
function Kc(t) {
  let e = xs;
  return (xs = t), e;
}
var Cm = 256,
  gd = Cm - 1,
  md = 5,
  wm = 0,
  je = {};
function Em(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(Hn) && (n = r[Hn]),
    n == null && (n = r[Hn] = wm++);
  let i = n & gd,
    o = 1 << i;
  e.data[t + (i >> md)] |= o;
}
function bi(t, e) {
  let r = vd(t, e);
  if (r !== -1) return r;
  let n = e[N];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    cs(n.data, t),
    cs(e, null),
    cs(n.blueprint, null));
  let i = ya(t, e),
    o = t.injectorIndex;
  if (pd(i)) {
    let s = Ei(i),
      a = Ii(i, e),
      u = a[N].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | u[s + c];
  }
  return (e[o + 8] = i), o;
}
function cs(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function vd(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function ya(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Ed(i)), n === null)) return dn;
    if ((r++, (i = i[Cn]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return dn;
}
function Ts(t, e, r) {
  Em(t, e, r);
}
function yd(t, e, r) {
  if (r & S.Optional || t !== void 0) return t;
  ca(e, "NodeInjector");
}
function Dd(t, e, r, n) {
  if (
    (r & S.Optional && n === void 0 && (n = null), !(r & (S.Self | S.Host)))
  ) {
    let i = t[hn],
      o = Ce(void 0);
    try {
      return i ? i.get(e, n, r & S.Optional) : Tl(e, n, r & S.Optional);
    } finally {
      Ce(o);
    }
  }
  return yd(n, e, r);
}
function Cd(t, e, r, n = S.Default, i) {
  if (t !== null) {
    if (e[E] & 2048 && !(n & S.Self)) {
      let s = Sm(t, e, r, n, je);
      if (s !== je) return s;
    }
    let o = wd(t, e, r, n, je);
    if (o !== je) return o;
  }
  return Dd(e, r, n, i);
}
function wd(t, e, r, n, i) {
  let o = Mm(r);
  if (typeof o == "function") {
    if (!od(e, t, n)) return n & S.Host ? yd(i, r, n) : Dd(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & S.Optional))) ca(r);
      else return s;
    } finally {
      cd();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = vd(t, e),
      u = dn,
      c = n & S.Host ? e[Ue][Re] : null;
    for (
      (a === -1 || n & S.SkipSelf) &&
      ((u = a === -1 ? ya(t, e) : e[a + 8]),
      u === dn || !Xc(n, !1)
        ? (a = -1)
        : ((s = e[N]), (a = Ei(u)), (e = Ii(u, e))));
      a !== -1;

    ) {
      let l = e[N];
      if (Jc(o, a, l.data)) {
        let d = Im(a, e, r, s, n, c);
        if (d !== je) return d;
      }
      (u = e[a + 8]),
        u !== dn && Xc(n, e[N].data[a + 8] === c) && Jc(o, a, e)
          ? ((s = l), (a = Ei(u)), (e = Ii(u, e)))
          : (a = -1);
    }
  }
  return i;
}
function Im(t, e, r, n, i, o) {
  let s = e[N],
    a = s.data[t + 8],
    u = n == null ? Ui(a) && xs : n != s && (a.type & 3) !== 0,
    c = i & S.Host && o === a,
    l = bm(a, s, r, u, c);
  return l !== null ? gn(e, s, l, a) : je;
}
function bm(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    u = t.directiveStart,
    c = t.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : c;
  for (let h = d; h < f; h++) {
    let m = s[h];
    if ((h < u && r === m) || (h >= u && m.type === r)) return h;
  }
  if (i) {
    let h = s[u];
    if (h && ht(h) && h.type === r) return u;
  }
  return null;
}
function gn(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (mm(i)) {
    let s = i;
    s.resolving && dg(lg(o[r]));
    let a = Kc(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? Ce(s.injectImpl) : null,
      l = od(t, n, S.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && pm(r, o[r], e);
    } finally {
      c !== null && Ce(c), Kc(a), (s.resolving = !1), cd();
    }
  }
  return i;
}
function Mm(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Hn) ? t[Hn] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & gd : _m) : e;
}
function Jc(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> md)] & n);
}
function Xc(t, e) {
  return !(t & S.Self) && !(t & S.Host && e);
}
var Nt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return Cd(this._tNode, this._lView, e, ji(n), r);
  }
};
function _m() {
  return new Nt(Ie(), B());
}
function Bt(t) {
  return ir(() => {
    let e = t.prototype.constructor,
      r = e[mi] || As(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[mi] || As(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function As(t) {
  return El(t)
    ? () => {
        let e = As(ne(t));
        return e && e();
      }
    : pn(t);
}
function Sm(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[E] & 2048 && !(s[E] & 512); ) {
    let a = wd(o, s, r, n | S.Self, je);
    if (a !== je) return a;
    let u = o.parent;
    if (!u) {
      let c = s[Bl];
      if (c) {
        let l = c.get(r, je, n);
        if (l !== je) return l;
      }
      (u = Ed(s)), (s = s[Cn]);
    }
    o = u;
  }
  return i;
}
function Ed(t) {
  let e = t[N],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Re] : null;
}
var ai = "__parameters__";
function xm(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Id(t, e, r) {
  return ir(() => {
    let n = xm(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(u, c, l) {
        let d = u.hasOwnProperty(ai)
          ? u[ai]
          : Object.defineProperty(u, ai, { value: [] })[ai];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), u;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function Tm(t) {
  let e = pe.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Am(t) {
  return typeof t == "function";
}
function Da(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Da(r, e) : e(r)));
}
function bd(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Mi(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Nm(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function Om(t, e, r) {
  let n = sr(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Nm(t, n, e, r)), n;
}
function ls(t, e) {
  let r = sr(t, e);
  if (r >= 0) return t[r | 1];
}
function sr(t, e) {
  return Rm(t, e, 1);
}
function Rm(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var Gi = Al(Id("Optional"), 8);
var Ca = Al(Id("SkipSelf"), 4);
function Fm(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let o = r.get(i);
    if (!o) {
      let s = t(i);
      r.set(i, (o = s.then(Vm)));
    }
    return o;
  }
  return (
    _i.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          n(i.templateUrl).then((c) => {
            i.template = c;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let c = i.styles.length,
          l = i.styleUrls;
        i.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              n(d).then((h) => {
                (a[c + f] = h),
                  l.splice(l.indexOf(d), 1),
                  l.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            n(i.styleUrl).then((c) => {
              a.push(c), (i.styleUrl = void 0);
            })
          );
      let u = Promise.all(s).then(() => jm(o));
      e.push(u);
    }),
    km(),
    Promise.all(e).then(() => {})
  );
}
var _i = new Map(),
  Pm = new Set();
function km() {
  let t = _i;
  return (_i = new Map()), t;
}
function Lm() {
  return _i.size === 0;
}
function Vm(t) {
  return typeof t == "string" ? t : t.text();
}
function jm(t) {
  Pm.delete(t);
}
var mn = new C("ENVIRONMENT_INITIALIZER"),
  Md = new C("INJECTOR", -1),
  _d = new C("INJECTOR_DEF_TYPES"),
  Si = class {
    get(e, r = Wn) {
      if (r === Wn) {
        let n = new Error(`NullInjectorError: No provider for ${re(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function $m(...t) {
  return { ɵproviders: Sd(!0, t), ɵfromNgModule: !0 };
}
function Sd(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Da(e, (s) => {
      let a = s;
      Ns(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && xd(i, o),
    r
  );
}
function xd(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    wa(i, (o) => {
      e(o, n);
    });
  }
}
function Ns(t, e, r, n) {
  if (((t = ne(t)), !t)) return !1;
  let i = null,
    o = Bc(t),
    s = !o && dt(t);
  if (!o && !s) {
    let u = t.ngModule;
    if (((o = Bc(u)), o)) i = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) Ns(c, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let c;
      try {
        Da(o.imports, (l) => {
          Ns(l, e, r, n) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && xd(c, e);
    }
    if (!a) {
      let c = pn(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: we }, i),
        e({ provide: _d, useValue: i, multi: !0 }, i),
        e({ provide: mn, useValue: () => D(i), multi: !0 }, i);
    }
    let u = o.providers;
    if (u != null && !a) {
      let c = t;
      wa(u, (l) => {
        e(l, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function wa(t, e) {
  for (let r of t)
    Il(r) && (r = r.ɵproviders), Array.isArray(r) ? wa(r, e) : e(r);
}
var Bm = V({ provide: String, useValue: V });
function Td(t) {
  return t !== null && typeof t == "object" && Bm in t;
}
function Um(t) {
  return !!(t && t.useExisting);
}
function Hm(t) {
  return !!(t && t.useFactory);
}
function vn(t) {
  return typeof t == "function";
}
function zm(t) {
  return !!t.useClass;
}
var Wi = new C("Set Injector scope."),
  hi = {},
  Gm = {},
  ds;
function Ea() {
  return ds === void 0 && (ds = new Si()), ds;
}
var ge = class {},
  Xn = class extends ge {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Rs(e, (s) => this.processProvider(s)),
        this.records.set(Md, an(void 0, this)),
        i.has("environment") && this.records.set(ge, an(void 0, this));
      let o = this.records.get(Wi);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(_d, we, S.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = ct(this),
        n = Ce(void 0),
        i;
      try {
        return e();
      } finally {
        ct(r), Ce(n);
      }
    }
    get(e, r = Wn, n = S.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(jc))) return e[jc](this);
      n = ji(n);
      let i,
        o = ct(this),
        s = Ce(void 0);
      try {
        if (!(n & S.SkipSelf)) {
          let u = this.records.get(e);
          if (u === void 0) {
            let c = Qm(e) && Vi(e);
            c && this.injectableDefInScope(c)
              ? (u = an(Os(e), hi))
              : (u = null),
              this.records.set(e, u);
          }
          if (u != null) return this.hydrate(e, u);
        }
        let a = n & S.Self ? Ea() : this.parent;
        return (r = n & S.Optional && r === Wn ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[vi] = a[vi] || []).unshift(re(e)), o)) throw a;
          return Ig(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Ce(s), ct(o);
      }
    }
    resolveInjectorInitializers() {
      let e = ct(this),
        r = Ce(void 0),
        n;
      try {
        let i = this.get(mn, we, S.Self);
        for (let o of i) o();
      } finally {
        ct(e), Ce(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(re(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1);
    }
    processProvider(e) {
      e = ne(e);
      let r = vn(e) ? e : ne(e && e.provide),
        n = qm(e);
      if (!vn(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = an(void 0, hi, !0)),
          (i.factory = () => Is(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === hi && ((r.value = Gm), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          Ym(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = ne(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Os(t) {
  let e = Vi(t),
    r = e !== null ? e.factory : pn(t);
  if (r !== null) return r;
  if (t instanceof C) throw new v(204, !1);
  if (t instanceof Function) return Wm(t);
  throw new v(204, !1);
}
function Wm(t) {
  if (t.length > 0) throw new v(204, !1);
  let r = pg(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function qm(t) {
  if (Td(t)) return an(void 0, t.useValue);
  {
    let e = Ad(t);
    return an(e, hi);
  }
}
function Ad(t, e, r) {
  let n;
  if (vn(t)) {
    let i = ne(t);
    return pn(i) || Os(i);
  } else if (Td(t)) n = () => ne(t.useValue);
  else if (Hm(t)) n = () => t.useFactory(...Is(t.deps || []));
  else if (Um(t)) n = () => D(ne(t.useExisting));
  else {
    let i = ne(t && (t.useClass || t.provide));
    if (Zm(t)) n = () => new i(...Is(t.deps));
    else return pn(i) || Os(i);
  }
  return n;
}
function an(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function Zm(t) {
  return !!t.deps;
}
function Ym(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function Qm(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof C);
}
function Rs(t, e) {
  for (let r of t)
    Array.isArray(r) ? Rs(r, e) : r && Il(r) ? Rs(r.ɵproviders, e) : e(r);
}
function mt(t, e) {
  t instanceof Xn && t.assertNotDestroyed();
  let r,
    n = ct(t),
    i = Ce(void 0);
  try {
    return e();
  } finally {
    ct(n), Ce(i);
  }
}
function Km(t) {
  if (!xl() && !Cg()) throw new v(-203, !1);
}
function el(t, e = null, r = null, n) {
  let i = Nd(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Nd(t, e = null, r = null, n, i = new Set()) {
  let o = [r || we, $m(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : re(t))),
    new Xn(o, e || Ea(), n || null, i)
  );
}
var be = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return el({ name: "" }, i, n, "");
      {
        let o = n.name ?? "";
        return el({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Wn),
    (e.NULL = new Si()),
    (e.ɵprov = y({ token: e, providedIn: "any", factory: () => D(Md) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var Fs;
function Od(t) {
  Fs = t;
}
function Jm() {
  if (Fs !== void 0) return Fs;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var qi = new C("AppId", { providedIn: "root", factory: () => Xm }),
  Xm = "ng",
  Ia = new C("Platform Initializer"),
  vt = new C("Platform ID", {
    providedIn: "platform",
    factory: () => "unknown",
  });
var ba = new C("CSP nonce", {
  providedIn: "root",
  factory: () =>
    Jm().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
function Rd(t) {
  return t instanceof Function ? t() : t;
}
function ev(t) {
  return (t ?? p(be)).get(vt) === "browser";
}
function Fd(t) {
  return (t.flags & 128) === 128;
}
var Xe = (function (t) {
  return (
    (t[(t.Important = 1)] = "Important"), (t[(t.DashCase = 2)] = "DashCase"), t
  );
})(Xe || {});
var Pd = new Map(),
  tv = 0;
function nv() {
  return tv++;
}
function rv(t) {
  Pd.set(t[Bi], t);
}
function iv(t) {
  Pd.delete(t[Bi]);
}
var tl = "__ngContext__";
function kt(t, e) {
  At(e) ? ((t[tl] = e[Bi]), rv(e)) : (t[tl] = e);
}
var ov;
function Ma(t, e) {
  return ov(t, e);
}
function un(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    tt(n) ? (o = n) : At(n) && ((s = !0), (n = n[et]));
    let a = He(n);
    t === 0 && r !== null
      ? i == null
        ? $d(e, r, a)
        : xi(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? xi(e, r, a, i || null, !0)
      : t === 2
      ? Ev(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && bv(e, t, o, r, i);
  }
}
function sv(t, e) {
  return t.createText(e);
}
function av(t, e, r) {
  t.setValue(e, r);
}
function kd(t, e, r) {
  return t.createElement(e, r);
}
function uv(t, e) {
  Ld(t, e), (e[et] = null), (e[Re] = null);
}
function cv(t, e, r, n, i, o) {
  (n[et] = i), (n[Re] = e), Zi(t, n, r, 1, i, o);
}
function Ld(t, e) {
  e[Be].changeDetectionScheduler?.notify(), Zi(t, e, e[ee], 2, null, null);
}
function lv(t) {
  let e = t[Yn];
  if (!e) return fs(t[N], t);
  for (; e; ) {
    let r = null;
    if (At(e)) r = e[Yn];
    else {
      let n = e[Ee];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[Ne] && e !== t; ) At(e) && fs(e[N], e), (e = e[te]);
      e === null && (e = t), At(e) && fs(e[N], e), (r = e && e[Ne]);
    }
    e = r;
  }
}
function dv(t, e, r, n) {
  let i = Ee + n,
    o = r.length;
  n > 0 && (r[i - 1][Ne] = e),
    n < o - Ee
      ? ((e[Ne] = r[i]), bd(r, Ee + n, e))
      : (r.push(e), (e[Ne] = null)),
    (e[te] = r);
  let s = e[$i];
  s !== null && r !== s && fv(s, e);
  let a = e[Qn];
  a !== null && a.insertView(t), _s(e), (e[E] |= 128);
}
function fv(t, e) {
  let r = t[Ci],
    i = e[te][te][Ue];
  e[Ue] !== i && (t[E] |= la.HasTransplantedViews),
    r === null ? (t[Ci] = [e]) : r.push(e);
}
function Vd(t, e) {
  let r = t[Ci],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function Ps(t, e) {
  if (t.length <= Ee) return;
  let r = Ee + e,
    n = t[r];
  if (n) {
    let i = n[$i];
    i !== null && i !== t && Vd(i, n), e > 0 && (t[r - 1][Ne] = n[Ne]);
    let o = Mi(t, Ee + e);
    uv(n[N], n);
    let s = o[Qn];
    s !== null && s.detachView(o[N]),
      (n[te] = null),
      (n[Ne] = null),
      (n[E] &= -129);
  }
  return n;
}
function jd(t, e) {
  if (!(e[E] & 256)) {
    let r = e[ee];
    r.destroyNode && Zi(t, e, r, 3, null, null), lv(e);
  }
}
function fs(t, e) {
  if (!(e[E] & 256)) {
    (e[E] &= -129),
      (e[E] |= 256),
      e[Ot] && fc(e[Ot]),
      pv(t, e),
      hv(t, e),
      e[N].type === 1 && e[ee].destroy();
    let r = e[$i];
    if (r !== null && tt(e[te])) {
      r !== e[te] && Vd(r, e);
      let n = e[Qn];
      n !== null && n.detachView(t);
    }
    iv(e);
  }
}
function hv(t, e) {
  let r = t.cleanup,
    n = e[Zn];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Zn] = null);
  let i = e[lt];
  if (i !== null) {
    e[lt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function pv(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Pt)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              u = o[s + 1];
            Ve(4, a, u);
            try {
              u.call(a);
            } finally {
              Ve(5, a, u);
            }
          }
        else {
          Ve(4, i, o);
          try {
            o.call(i);
          } finally {
            Ve(5, i, o);
          }
        }
      }
    }
}
function gv(t, e, r) {
  return mv(t, e.parent, r);
}
function mv(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[et];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === $e.None || o === $e.Emulated) return null;
    }
    return Fe(n, r);
  }
}
function xi(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function $d(t, e, r) {
  t.appendChild(e, r);
}
function nl(t, e, r, n, i) {
  n !== null ? xi(t, e, r, n, i) : $d(t, e, r);
}
function vv(t, e, r, n) {
  t.removeChild(e, r, n);
}
function _a(t, e) {
  return t.parentNode(e);
}
function yv(t, e) {
  return t.nextSibling(e);
}
function Dv(t, e, r) {
  return wv(t, e, r);
}
function Cv(t, e, r) {
  return t.type & 40 ? Fe(t, r) : null;
}
var wv = Cv,
  rl;
function Sa(t, e, r, n) {
  let i = gv(t, n, e),
    o = e[ee],
    s = n.parent || e[Re],
    a = Dv(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let u = 0; u < r.length; u++) nl(o, i, r[u], a, !1);
    else nl(o, i, r, a, !1);
  rl !== void 0 && rl(o, n, e, r, i);
}
function pi(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return Fe(e, t);
    if (r & 4) return ks(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return pi(t, n);
      {
        let i = t[e.index];
        return tt(i) ? ks(-1, i) : He(i);
      }
    } else {
      if (r & 32) return Ma(e, t)() || He(t[e.index]);
      {
        let n = Bd(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = Jn(t[Ue]);
          return pi(i, n);
        } else return pi(t, e.next);
      }
    }
  }
  return null;
}
function Bd(t, e) {
  if (e !== null) {
    let n = t[Ue][Re],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function ks(t, e) {
  let r = Ee + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[N].firstChild;
    if (i !== null) return pi(n, i);
  }
  return e[Rt];
}
function Ev(t, e, r) {
  let n = _a(t, e);
  n && vv(t, n, e, r);
}
function xa(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      u = r.type;
    if (
      (s && e === 0 && (a && kt(He(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (u & 8) xa(t, e, r.child, n, i, o, !1), un(e, t, i, a, o);
      else if (u & 32) {
        let c = Ma(r, n),
          l;
        for (; (l = c()); ) un(e, t, i, l, o);
        un(e, t, i, a, o);
      } else u & 16 ? Iv(t, e, n, r, i, o) : un(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function Zi(t, e, r, n, i, o) {
  xa(r, n, t.firstChild, e, i, o, !1);
}
function Iv(t, e, r, n, i, o) {
  let s = r[Ue],
    u = s[Re].projection[n.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      un(e, t, i, l, o);
    }
  else {
    let c = u,
      l = s[te];
    Fd(n) && (c.flags |= 128), xa(t, e, c, l, i, o, !0);
  }
}
function bv(t, e, r, n, i) {
  let o = r[Rt],
    s = He(r);
  o !== s && un(e, t, n, o, i);
  for (let a = Ee; a < r.length; a++) {
    let u = r[a];
    Zi(u[N], u, t, e, n, o);
  }
}
function Mv(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : Xe.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= Xe.Important)),
        t.setStyle(r, n, i, o));
  }
}
function _v(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Ud(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Hd(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && bs(t, e, n),
    i !== null && Ud(t, e, i),
    o !== null && _v(t, e, o);
}
var Ti = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${bl})`;
  }
};
function Yi(t) {
  return t instanceof Ti ? t.changingThisBreaksApplicationSecurity : t;
}
function zd(t, e) {
  let r = Sv(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${bl})`);
  }
  return r === e;
}
function Sv(t) {
  return (t instanceof Ti && t.getTypeName()) || null;
}
var xv = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Gd(t) {
  return (t = String(t)), t.match(xv) ? t : "unsafe:" + t;
}
var Ta = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Ta || {});
function En(t) {
  let e = Tv();
  return e ? e.sanitize(Ta.URL, t) || "" : zd(t, "URL") ? Yi(t) : Gd(Gn(t));
}
function Tv() {
  let t = B();
  return t && t[Be].sanitizer;
}
var Ls = class {};
var Av = "h",
  Nv = "b";
var Ov = () => null;
function Aa(t, e, r = !1) {
  return Ov(t, e, r);
}
var Vs = class {},
  Ai = class {};
function Rv(t) {
  let e = Error(`No component factory found for ${re(t)}.`);
  return (e[Fv] = t), e;
}
var Fv = "ngComponent";
var js = class {
    resolveComponentFactory(e) {
      throw Rv(e);
    }
  },
  Qi = (() => {
    let e = class e {};
    e.NULL = new js();
    let t = e;
    return t;
  })();
function Pv() {
  return Ki(Ie(), B());
}
function Ki(t, e) {
  return new nt(Fe(t, e));
}
var nt = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Pv;
  let t = e;
  return t;
})();
var er = class {},
  yt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => kv();
    let t = e;
    return t;
  })();
function kv() {
  let t = B(),
    e = Ie(),
    r = gt(e.index, t);
  return (At(r) ? r : t)[ee];
}
var Lv = (() => {
    let e = class e {};
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  hs = {};
function Wd(t) {
  return jv(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Vv(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function jv(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var $s = class {
    constructor() {}
    supports(e) {
      return Wd(e);
    }
    create(e) {
      return new Bs(e);
    }
  },
  $v = (t, e) => e,
  Bs = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || $v);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < il(n, i, o)) ? r : n,
          a = il(s, i, o),
          u = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            l = u - i;
          if (c != l) {
            for (let f = 0; f < c; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                m = h + f;
              l <= m && m < c && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = l - c;
          }
        }
        a !== u && e(s, a, u);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !Wd(e))) throw new v(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          Vv(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Us(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Ni()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Ni()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Us = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Hs = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  Ni = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new Hs()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function il(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function ol() {
  return new Na([new $s()]);
}
var Na = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || ol()),
        deps: [[e, new Ca(), new Gi()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new v(901, !1);
    }
  };
  e.ɵprov = y({ token: e, providedIn: "root", factory: ol });
  let t = e;
  return t;
})();
function Oi(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(He(o)), tt(o) && Bv(o, n);
    let s = r.type;
    if (s & 8) Oi(t, e, r.child, n);
    else if (s & 32) {
      let a = Ma(r, e),
        u;
      for (; (u = a()); ) n.push(u);
    } else if (s & 16) {
      let a = Bd(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let u = Jn(e[Ue]);
        Oi(u[N], u, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function Bv(t, e) {
  for (let r = Ee; r < t.length; r++) {
    let n = t[r],
      i = n[N].firstChild;
    i !== null && Oi(n[N], n, i, e);
  }
  t[Rt] !== t[et] && e.push(t[Rt]);
}
var qd = [];
function Uv(t) {
  return t[Ot] ?? Hv(t);
}
function Hv(t) {
  let e = qd.pop() ?? Object.create(Gv);
  return (e.lView = t), e;
}
function zv(t) {
  t.lView[Ot] !== t && ((t.lView = null), qd.push(t));
}
var Gv = j(g({}, cc), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Kn(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[Ot] = this;
  },
});
function Zd(t) {
  return Qd(t[Yn]);
}
function Yd(t) {
  return Qd(t[Ne]);
}
function Qd(t) {
  for (; t !== null && !tt(t); ) t = t[Ne];
  return t;
}
var Wv = "ngOriginalError";
function ps(t) {
  return t[Wv];
}
var ze = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && ps(e);
      for (; r && ps(r); ) r = ps(r);
      return r || null;
    }
  },
  Kd = new C("", {
    providedIn: "root",
    factory: () => p(ze).handleError.bind(void 0),
  });
var Jd = !1,
  qv = new C("", { providedIn: "root", factory: () => Jd });
var rt = {};
function z(t = 1) {
  Xd(Pe(), B(), $t() + t, !1);
}
function Xd(t, e, r, n) {
  if (!n)
    if ((e[E] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && di(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && fi(e, o, 0, r);
    }
  Ft(r);
}
function L(t, e = S.Default) {
  let r = B();
  if (r === null) return D(t, e);
  let n = Ie();
  return Cd(n, r, ne(t), e);
}
function ef() {
  let t = "invalid";
  throw new Error(t);
}
function Zv(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Ft(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          um(s, o);
          let u = e[o];
          a(2, u);
        }
      }
    } finally {
      Ft(-1);
    }
}
function Ji(t, e, r, n, i, o, s, a, u, c, l) {
  let d = e.blueprint.slice();
  return (
    (d[et] = i),
    (d[E] = n | 4 | 128 | 8 | 64),
    (c !== null || (t && t[E] & 2048)) && (d[E] |= 2048),
    Ql(d),
    (d[te] = d[Cn] = t),
    (d[Oe] = r),
    (d[Be] = s || (t && t[Be])),
    (d[ee] = a || (t && t[ee])),
    (d[hn] = u || (t && t[hn]) || null),
    (d[Re] = o),
    (d[Bi] = nv()),
    (d[yi] = l),
    (d[Bl] = c),
    (d[Ue] = e.type == 2 ? t[Ue] : d),
    d
  );
}
function Xi(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = Yv(t, e, r, n, i)), am() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = rm();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return or(o, !0), o;
}
function Yv(t, e, r, n, i) {
  let o = ed(),
    s = td(),
    a = s ? o : o && o.parent,
    u = (t.data[e] = ey(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  );
}
function tf(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function nf(t, e, r, n, i) {
  let o = $t(),
    s = n & 2;
  try {
    Ft(-1), s && e.length > ft && Xd(t, e, ft, !1), Ve(s ? 2 : 0, i), r(n, i);
  } finally {
    Ft(o), Ve(s ? 3 : 1, i);
  }
}
function rf(t, e, r) {
  if (Hl(e)) {
    let n = de(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, r[s], s);
      }
    } finally {
      de(n);
    }
  }
}
function of(t, e, r) {
  Xl() && (sy(t, e, r, Fe(r, e)), (r.flags & 64) === 64 && df(t, e, r));
}
function sf(t, e, r = Fe) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function af(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Oa(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Oa(t, e, r, n, i, o, s, a, u, c, l) {
  let d = ft + n,
    f = d + i,
    h = Qv(d, f),
    m = typeof c == "function" ? c() : c;
  return (h[N] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Qv(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : rt);
  return r;
}
function Kv(t, e, r, n) {
  let o = n.get(qv, Jd) || r === $e.ShadowDom,
    s = t.selectRootElement(e, o);
  return Jv(s), s;
}
function Jv(t) {
  Xv(t);
}
var Xv = () => null;
function ey(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    em() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function sl(t, e, r, n) {
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      r = r === null ? {} : r;
      let o = t[i];
      n === null ? al(r, e, i, o) : n.hasOwnProperty(i) && al(r, e, n[i], o);
    }
  return r;
}
function al(t, e, r, n) {
  t.hasOwnProperty(r) ? t[r].push(e, n) : (t[r] = [e, n]);
}
function ty(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      m = f ? f.outputs : null;
    (u = sl(d.inputs, l, u, h)), (c = sl(d.outputs, l, c, m));
    let R = u !== null && s !== null && !Fl(e) ? gy(u, l, s) : null;
    a.push(R);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (e.flags |= 8),
    u.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = u),
    (e.outputs = c);
}
function ny(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function uf(t, e, r, n, i, o, s, a) {
  let u = Fe(e, r),
    c = e.inputs,
    l;
  !a && c != null && (l = c[n])
    ? (Ra(t, r, l, n, i), Ui(e) && ry(r, e.index))
    : e.type & 3
    ? ((n = ny(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(u, n, i))
    : e.type & 12;
}
function ry(t, e) {
  let r = gt(e, t);
  r[E] & 16 || (r[E] |= 64);
}
function cf(t, e, r, n) {
  if (Xl()) {
    let i = n === null ? null : { "": -1 },
      o = uy(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && lf(t, e, r, s, i, a),
      i && cy(r, n, i);
  }
  r.mergedAttrs = qn(r.mergedAttrs, r.attrs);
}
function lf(t, e, r, n, i, o) {
  for (let c = 0; c < n.length; c++) Ts(bi(r, e), t, n[c].type);
  dy(r, t.data.length, n.length);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = tf(t, e, n.length, null);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    (r.mergedAttrs = qn(r.mergedAttrs, l.hostAttrs)),
      fy(t, r, e, u, l),
      ly(u, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      u++;
  }
  ty(t, r, o);
}
function iy(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    oy(s) != a && s.push(a), s.push(r, n, o);
  }
}
function oy(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function sy(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Ui(r) && hy(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || bi(r, e),
    kt(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let u = t.data[a],
      c = gn(e, t, a, r);
    if ((kt(c, e), s !== null && py(e, a - i, c, u, r, s), ht(u))) {
      let l = gt(r.index, e);
      l[Oe] = gn(e, t, a, r);
    }
  }
}
function df(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = cm();
  try {
    Ft(o);
    for (let a = n; a < i; a++) {
      let u = t.data[a],
        c = e[a];
      Ss(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          ay(u, c);
    }
  } finally {
    Ft(-1), Ss(s);
  }
}
function ay(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function uy(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (Ng(e, s.selectors, !1))
        if ((n || (n = []), ht(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let u = a.length;
            zs(t, e, u);
          } else n.unshift(s), zs(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function zs(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function cy(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new v(-301, !1);
      n.push(e[i], o);
    }
  }
}
function ly(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    ht(e) && (r[""] = t);
  }
}
function dy(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function fy(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = pn(i.type, !0)),
    s = new Pt(o, ht(i), L);
  (t.blueprint[n] = s), (r[n] = s), iy(t, e, n, tf(t, r, i.hostVars, rt), i);
}
function hy(t, e, r) {
  let n = Fe(e, t),
    i = af(r),
    o = t[Be].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = eo(
    t,
    Ji(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function py(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++];
      ff(n, r, u, c, l);
    }
}
function ff(t, e, r, n, i) {
  let o = de(null);
  try {
    let s = t.inputTransforms;
    s !== null && s.hasOwnProperty(n) && (i = s[n].call(e, i)),
      t.setInput !== null ? t.setInput(e, i, r, n) : (e[n] = i);
  } finally {
    de(o);
  }
}
function gy(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 2)
        if (s[a] === e) {
          n.push(o, s[a + 1], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function hf(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function pf(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = de(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          id(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      de(n);
    }
  }
}
function eo(t, e) {
  return t[Yn] ? (t[Zc][Ne] = e) : (t[Yn] = e), (t[Zc] = e), e;
}
function Gs(t, e, r) {
  id(0);
  let n = de(null);
  try {
    e(t, r);
  } finally {
    de(n);
  }
}
function my(t) {
  return t[Zn] || (t[Zn] = []);
}
function vy(t) {
  return t.cleanup || (t.cleanup = []);
}
function gf(t, e) {
  let r = t[hn],
    n = r ? r.get(ze, null) : null;
  n && n.handleError(e);
}
function Ra(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      u = e[s],
      c = t.data[s];
    ff(c, u, n, a, i);
  }
}
function mf(t, e, r) {
  let n = Zl(e, t);
  av(t[ee], n, r);
}
var yy = 100;
function Dy(t, e = !0) {
  let r = t[Be],
    n = r.rendererFactory,
    i = !1;
  i || n.begin?.();
  try {
    Cy(t);
  } catch (o) {
    throw (e && gf(t, o), o);
  } finally {
    i || (n.end?.(), r.inlineEffectRunner?.flush());
  }
}
function Cy(t) {
  Ws(t, 0);
  let e = 0;
  for (; Kl(t); ) {
    if (e === yy) throw new v(103, !1);
    e++, Ws(t, 1);
  }
}
function wy(t, e, r, n) {
  let i = e[E];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Be].inlineEffectRunner?.flush(), ha(e);
  let s = null,
    a = null;
  !o && Ey(t) && ((a = Uv(e)), (s = lc(a)));
  try {
    Ql(e), sm(t.bindingStartIndex), r !== null && nf(t, e, r, 2, n);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let d = t.preOrderCheckHooks;
        d !== null && di(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && fi(e, d, 0, null), us(e, 0);
      }
    if ((Iy(e), vf(e, 0), t.contentQueries !== null && pf(t, e), !o))
      if (u) {
        let d = t.contentCheckHooks;
        d !== null && di(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && fi(e, d, 1), us(e, 1);
      }
    Zv(t, e);
    let c = t.components;
    c !== null && Df(e, c, 0);
    let l = t.viewQuery;
    if ((l !== null && Gs(2, l, n), !o))
      if (u) {
        let d = t.viewCheckHooks;
        d !== null && di(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && fi(e, d, 2), us(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[as])) {
      for (let d of e[as]) d();
      e[as] = null;
    }
    o || (e[E] &= -73);
  } catch (u) {
    throw (Kn(e), u);
  } finally {
    a !== null && (dc(a, s), zv(a)), pa();
  }
}
function Ey(t) {
  return t.type !== 2;
}
function vf(t, e) {
  for (let r = Zd(t); r !== null; r = Yd(r))
    for (let n = Ee; n < r.length; n++) {
      let i = r[n];
      yf(i, e);
    }
}
function Iy(t) {
  for (let e = Zd(t); e !== null; e = Yd(e)) {
    if (!(e[E] & la.HasTransplantedViews)) continue;
    let r = e[Ci];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[te];
      Zg(i);
    }
  }
}
function by(t, e, r) {
  let n = gt(e, t);
  yf(n, r);
}
function yf(t, e) {
  fa(t) && Ws(t, e);
}
function Ws(t, e) {
  let n = t[N],
    i = t[E],
    o = t[Ot],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Uo(o))),
    o && (o.dirty = !1),
    (t[E] &= -9217),
    s)
  )
    wy(n, t, n.template, t[Oe]);
  else if (i & 8192) {
    vf(t, 1);
    let a = n.components;
    a !== null && Df(t, a, 1);
  }
}
function Df(t, e, r) {
  for (let n = 0; n < e.length; n++) by(t, e[n], r);
}
function Fa(t) {
  for (t[Be].changeDetectionScheduler?.notify(); t; ) {
    t[E] |= 64;
    let e = Jn(t);
    if ($g(t) && !e) return t;
    t = e;
  }
  return null;
}
var Lt = class {
    get rootNodes() {
      let e = this._lView,
        r = e[N];
      return Oi(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Oe];
    }
    set context(e) {
      this._lView[Oe] = e;
    }
    get destroyed() {
      return (this._lView[E] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[te];
        if (tt(e)) {
          let r = e[Di],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (Ps(e, n), Mi(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      jd(this._lView[N], this._lView);
    }
    onDestroy(e) {
      Jl(this._lView, e);
    }
    markForCheck() {
      Fa(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[E] &= -129;
    }
    reattach() {
      _s(this._lView), (this._lView[E] |= 128);
    }
    detectChanges() {
      (this._lView[E] |= 1024), Dy(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new v(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Ld(this._lView[N], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new v(902, !1);
      (this._appRef = e), _s(this._lView);
    }
  },
  In = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = My;
    let t = e;
    return t;
  })();
function My(t) {
  return _y(Ie(), B(), (t & 16) === 16);
}
function _y(t, e, r) {
  if (Ui(t) && !r) {
    let n = gt(t.index, e);
    return new Lt(n, n);
  } else if (t.type & 47) {
    let n = e[Ue];
    return new Lt(n, e);
  }
  return null;
}
var Cf = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = Sy), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  qs = class extends Cf {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return Jl(this._lView, e), () => Qg(this._lView, e);
    }
  };
function Sy() {
  return new qs(B());
}
var ul = new Set();
function Pa(t) {
  ul.has(t) ||
    (ul.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Zs = class extends he {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let u = e;
      (i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((o = gs(o)), i && (i = gs(i)), s && (s = gs(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof Q && e.add(a), a;
  }
};
function gs(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var K = Zs;
function cl(...t) {}
function xy() {
  let t = typeof pe.requestAnimationFrame == "function",
    e = pe[t ? "requestAnimationFrame" : "setTimeout"],
    r = pe[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var $ = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new K(!1)),
        (this.onMicrotaskEmpty = new K(!1)),
        (this.onStable = new K(!1)),
        (this.onError = new K(!1)),
        typeof Zone > "u")
      )
        throw new v(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = xy().nativeRequestAnimationFrame),
        Ny(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new v(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, Ty, cl, cl);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  Ty = {};
function ka(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function Ay(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      pe,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Ys(t),
                (t.isCheckStableRunning = !0),
                ka(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Ys(t));
}
function Ny(t) {
  let e = () => {
    Ay(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (Oy(a)) return r.invokeTask(i, o, s, a);
      try {
        return ll(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          dl(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, u) => {
      try {
        return ll(t), r.invoke(i, o, s, a, u);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), dl(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), Ys(t), ka(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function Ys(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function ll(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function dl(t) {
  t._nesting--, ka(t);
}
var Qs = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new K()),
      (this.onMicrotaskEmpty = new K()),
      (this.onStable = new K()),
      (this.onError = new K());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function Oy(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function Ry(t = "zone.js", e) {
  return t === "noop" ? new Qs() : t === "zone.js" ? new $(e) : t;
}
var cn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(cn || {}),
  Fy = { destroy() {} };
function La(t, e) {
  !e && Km(La);
  let r = e?.injector ?? p(be);
  if (!ev(r)) return Fy;
  Pa("NgAfterNextRender");
  let n = r.get(Va),
    i = (n.handler ??= new Js()),
    o = e?.phase ?? cn.MixedReadWrite,
    s = () => {
      i.unregister(u), a();
    },
    a = r.get(Cf).onDestroy(s),
    u = new Ks(r, o, () => {
      s(), t();
    });
  return i.register(u), { destroy: s };
}
var Ks = class {
    constructor(e, r, n) {
      (this.phase = r),
        (this.callbackFn = n),
        (this.zone = e.get($)),
        (this.errorHandler = e.get(ze, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  Js = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [cn.EarlyRead]: new Set(),
          [cn.Write]: new Set(),
          [cn.MixedReadWrite]: new Set(),
          [cn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      let e = !1;
      this.executingCallbacks = !0;
      for (let r of Object.values(this.buckets))
        for (let n of r) (e = !0), n.invoke();
      this.executingCallbacks = !1;
      for (let r of this.deferredCallbacks) this.buckets[r.phase].add(r);
      return this.deferredCallbacks.clear(), e;
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Va = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let o of n) o();
        return !!this.handler?.execute() || n.length > 0;
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function Py(t, e) {
  let r = gt(e, t),
    n = r[N];
  ky(n, r);
  let i = r[et];
  i !== null && r[yi] === null && (r[yi] = Aa(i, r[hn])), ja(n, r, r[Oe]);
}
function ky(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function ja(t, e, r) {
  ha(e);
  try {
    let n = t.viewQuery;
    n !== null && Gs(1, n, r);
    let i = t.template;
    i !== null && nf(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && pf(t, e),
      t.staticViewQueries && Gs(2, t.viewQuery, r);
    let o = t.components;
    o !== null && Ly(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[E] &= -5), pa();
  }
}
function Ly(t, e) {
  for (let r = 0; r < e.length; r++) Py(t, e[r]);
}
function Xs(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = Vc(i, a);
      else if (o == 2) {
        let u = a,
          c = e[++s];
        n = Vc(n, u + ": " + c + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Ri = class extends Qi {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = dt(e);
    return new yn(r, this.ngModule);
  }
};
function fl(t) {
  let e = [];
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let n = t[r];
      e.push({ propName: n, templateName: r });
    }
  return e;
}
function Vy(t) {
  let e = t.toLowerCase();
  return e === "svg" ? ql : e === "math" ? zg : null;
}
var ea = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = ji(n);
      let i = this.injector.get(e, hs, n);
      return i !== hs || r === hs ? i : this.parentInjector.get(e, r, n);
    }
  },
  yn = class extends Ai {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = fl(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return fl(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Pg(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof ge ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new ea(e, o) : e,
        a = s.get(er, null);
      if (a === null) throw new v(407, !1);
      let u = s.get(Lv, null),
        c = s.get(Va, null),
        l = s.get(Ls, null),
        d = {
          rendererFactory: a,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
          changeDetectionScheduler: l,
        },
        f = a.createRenderer(null, this.componentDef),
        h = this.componentDef.selectors[0][0] || "div",
        m = n ? Kv(f, n, this.componentDef.encapsulation, s) : kd(f, h, Vy(h)),
        R = 512;
      this.componentDef.signals
        ? (R |= 4096)
        : this.componentDef.onPush || (R |= 16);
      let q = null;
      m !== null && (q = Aa(m, s, !0));
      let F = Oa(0, null, null, 1, 0, null, null, null, null, null, null),
        le = Ji(null, F, null, R, null, null, d, f, s, null, q);
      ha(le);
      let Ye, xe;
      try {
        let ke = this.componentDef,
          Qe,
          $o = null;
        ke.findHostDirectiveDefs
          ? ((Qe = []),
            ($o = new Map()),
            ke.findHostDirectiveDefs(ke, Qe, $o),
            Qe.push(ke))
          : (Qe = [ke]);
        let Sp = jy(le, m),
          xp = $y(Sp, m, ke, Qe, le, d, f);
        (xe = Yl(F, ft)),
          m && Hy(f, ke, m, n),
          r !== void 0 && zy(xe, this.ngContentSelectors, r),
          (Ye = Uy(xp, ke, Qe, $o, le, [Gy])),
          ja(F, le, null);
      } finally {
        pa();
      }
      return new ta(this.componentType, Ye, Ki(xe, le), le, xe);
    }
  },
  ta = class extends Vs {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Lt(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        Ra(o[N], o, i, e, r), this.previousInputValues.set(e, r);
        let s = gt(this._tNode.index, o);
        Fa(s);
      }
    }
    get injector() {
      return new Nt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function jy(t, e) {
  let r = t[N],
    n = ft;
  return (t[n] = e), Xi(r, n, 2, "#host", null);
}
function $y(t, e, r, n, i, o, s) {
  let a = i[N];
  By(n, t, e, s);
  let u = null;
  e !== null && (u = Aa(e, i[hn]));
  let c = o.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = Ji(i, af(r), null, l, i[t.index], t, o, c, null, null, u);
  return (
    a.firstCreatePass && zs(a, t, n.length - 1), eo(i, d), (i[t.index] = d)
  );
}
function By(t, e, r, n) {
  for (let i of t) e.mergedAttrs = qn(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Xs(e, e.mergedAttrs, !0), r !== null && Hd(n, r, e));
}
function Uy(t, e, r, n, i, o) {
  let s = Ie(),
    a = i[N],
    u = Fe(s, i);
  lf(a, i, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = gn(i, a, d, s);
    kt(f, i);
  }
  df(a, i, s), u && kt(u, i);
  let c = gn(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Oe] = i[Oe] = c), o !== null)) for (let l of o) l(c, e);
  return rf(a, s, t), c;
}
function Hy(t, e, r, n) {
  if (n) bs(t, r, ["ng-version", "17.0.9"]);
  else {
    let { attrs: i, classes: o } = kg(e.selectors[0]);
    i && bs(t, r, i), o && o.length > 0 && Ud(t, r, o.join(" "));
  }
}
function zy(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function Gy() {
  let t = Ie();
  va(B()[N], t);
}
function Wy(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Dt(t) {
  let e = Wy(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (ht(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new v(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = ui(t.inputs)),
          (s.inputTransforms = ui(t.inputTransforms)),
          (s.declaredInputs = ui(t.declaredInputs)),
          (s.outputs = ui(t.outputs));
        let a = i.hostBindings;
        a && Qy(t, a);
        let u = i.viewQuery,
          c = i.contentQueries;
        if (
          (u && Zy(t, u),
          c && Yy(t, c),
          si(t.inputs, i.inputs),
          si(t.declaredInputs, i.declaredInputs),
          si(t.outputs, i.outputs),
          i.inputTransforms !== null &&
            (s.inputTransforms === null && (s.inputTransforms = {}),
            si(s.inputTransforms, i.inputTransforms)),
          ht(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Dt && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  qy(n);
}
function qy(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = qn(i.hostAttrs, (r = qn(r, i.hostAttrs))));
  }
}
function ui(t) {
  return t === fn ? {} : t === we ? [] : t;
}
function Zy(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function Yy(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function Qy(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function tr(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function Ky(t, e, r, n) {
  let i = tr(t, e, r);
  return tr(t, e + 1, n) || i;
}
function wf(t, e, r, n) {
  return tr(t, nd(), r) ? e + Gn(r) + n : rt;
}
function Jy(t, e, r, n, i, o) {
  let s = om(),
    a = Ky(t, s, r, i);
  return rd(2), a ? e + Gn(r) + n + Gn(i) + o : rt;
}
function ci(t, e) {
  return (t << 17) | (e << 2);
}
function Vt(t) {
  return (t >> 17) & 32767;
}
function Xy(t) {
  return (t & 2) == 2;
}
function eD(t, e) {
  return (t & 131071) | (e << 17);
}
function na(t) {
  return t | 2;
}
function Dn(t) {
  return (t & 131068) >> 2;
}
function ms(t, e) {
  return (t & -131069) | (e << 2);
}
function tD(t) {
  return (t & 1) === 1;
}
function ra(t) {
  return t | 1;
}
function nD(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = Vt(s),
    u = Dn(s);
  t[n] = r;
  let c = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || sr(d, l) > 0) && (c = !0);
  } else l = r;
  if (i)
    if (u !== 0) {
      let f = Vt(t[a + 1]);
      (t[n + 1] = ci(f, a)),
        f !== 0 && (t[f + 1] = ms(t[f + 1], n)),
        (t[a + 1] = eD(t[a + 1], n));
    } else
      (t[n + 1] = ci(a, 0)), a !== 0 && (t[a + 1] = ms(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = ci(u, 0)),
      a === 0 ? (a = n) : (t[u + 1] = ms(t[u + 1], n)),
      (u = n);
  c && (t[n + 1] = na(t[n + 1])),
    hl(t, l, n, !0),
    hl(t, l, n, !1),
    rD(e, l, t, n, o),
    (s = ci(a, u)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function rD(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    sr(o, e) >= 0 &&
    (r[n + 1] = ra(r[n + 1]));
}
function hl(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? Vt(i) : Dn(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let u = t[s],
      c = t[s + 1];
    iD(u, e) && ((a = !0), (t[s + 1] = n ? ra(c) : na(c))),
      (s = n ? Vt(c) : Dn(c));
  }
  a && (t[r + 1] = n ? na(i) : ra(i));
}
function iD(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? sr(t, e) >= 0
    : !1;
}
function G(t, e, r) {
  let n = B(),
    i = nd();
  if (tr(n, i, e)) {
    let o = Pe(),
      s = ld();
    uf(o, s, n, t, e, n[ee], r, !1);
  }
  return G;
}
function pl(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Ra(t, r, o[s], s, n);
}
function $a(t, e) {
  return oD(t, e, null, !0), $a;
}
function oD(t, e, r, n) {
  let i = B(),
    o = Pe(),
    s = rd(2);
  if ((o.firstUpdatePass && aD(o, t, s, n), e !== rt && tr(i, s, e))) {
    let a = o.data[$t()];
    fD(o, a, i, i[ee], t, (i[s + 1] = hD(e, r)), n, s);
  }
}
function sD(t, e) {
  return e >= t.expandoStartIndex;
}
function aD(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[$t()],
      s = sD(t, r);
    pD(o, n) && e === null && !s && (e = !1),
      (e = uD(i, o, e, n)),
      nD(i, o, e, r, s, n);
  }
}
function uD(t, e, r, n) {
  let i = lm(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = vs(null, t, e, r, n)), (r = nr(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = vs(i, t, e, r, n)), o === null)) {
        let u = cD(t, e, n);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = vs(null, t, e, u[1], n)),
          (u = nr(u, e.attrs, n)),
          lD(t, e, n, u));
      } else o = dD(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function cD(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Dn(n) !== 0) return t[Vt(n)];
}
function lD(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[Vt(i)] = n;
}
function dD(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = nr(n, s, r);
  }
  return nr(n, e.attrs, r);
}
function vs(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = nr(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function nr(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Om(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function fD(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let u = t.data,
    c = u[a + 1],
    l = tD(c) ? gl(u, e, r, i, Dn(c), s) : void 0;
  if (!Fi(l)) {
    Fi(o) || (Xy(c) && (o = gl(u, null, r, i, a, s)));
    let d = Zl($t(), r);
    Mv(n, s, d, i, o);
  }
}
function gl(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let u = t[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = r[i + 1];
    f === rt && (f = d ? we : void 0);
    let h = d ? ls(f, n) : l === n ? f : void 0;
    if ((c && !Fi(h) && (h = ls(u, n)), Fi(h) && ((a = h), s))) return a;
    let m = t[i + 1];
    i = s ? Vt(m) : Dn(m);
  }
  if (e !== null) {
    let u = o ? e.residualClasses : e.residualStyles;
    u != null && (a = ls(u, n));
  }
  return a;
}
function Fi(t) {
  return t !== void 0;
}
function hD(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = re(Yi(t)))),
    t
  );
}
function pD(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var AS = new RegExp(`^(\\d+)*(${Nv}|${Av})*(.*)`);
var gD = () => null;
function ml(t, e) {
  return gD(t, e);
}
function mD(t, e, r, n) {
  let i = e.tView,
    s = t[E] & 4096 ? 4096 : 16,
    a = Ji(
      t,
      i,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    u = t[e.index];
  a[$i] = u;
  let c = t[Qn];
  return c !== null && (a[Qn] = c.createEmbeddedView(i)), ja(i, a, r), a;
}
function vl(t, e) {
  return !e || e.firstChild === null || Fd(t);
}
function vD(t, e, r, n = !0) {
  let i = e[N];
  if ((dv(i, e, t, r), n)) {
    let s = ks(r, t),
      a = e[ee],
      u = _a(a, t[Rt]);
    u !== null && cv(i, t[Re], a, e, u, s);
  }
  let o = e[yi];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
var bn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = yD;
  let t = e;
  return t;
})();
function yD() {
  let t = Ie();
  return CD(t, B());
}
var DD = bn,
  Ef = class extends DD {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ki(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Nt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = ya(this._hostTNode, this._hostLView);
      if (pd(e)) {
        let r = Ii(e, this._hostLView),
          n = Ei(e),
          i = r[N].data[n + 8];
        return new Nt(i, r);
      } else return new Nt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = yl(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - Ee;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = ml(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, vl(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !Am(e),
        a;
      if (s) a = r;
      else {
        let m = r || {};
        (a = m.index),
          (n = m.injector),
          (i = m.projectableNodes),
          (o = m.environmentInjector || m.ngModuleRef);
      }
      let u = s ? e : new yn(dt(e)),
        c = n || this.parentInjector;
      if (!o && u.ngModule == null) {
        let R = (s ? c : this.parentInjector).get(ge, null);
        R && (o = R);
      }
      let l = dt(u.componentType ?? {}),
        d = ml(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o);
      return this.insertImpl(h.hostView, a, vl(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (qg(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let u = i[te],
            c = new Ef(u, u[Re], u[te]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return vD(s, i, o, n), e.attachToViewContainerRef(), bd(ys(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = yl(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = Ps(this._lContainer, r);
      n && (Mi(ys(this._lContainer), r), jd(n[N], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = Ps(this._lContainer, r);
      return n && Mi(ys(this._lContainer), r) != null ? new Lt(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function yl(t) {
  return t[Di];
}
function ys(t) {
  return t[Di] || (t[Di] = []);
}
function CD(t, e) {
  let r,
    n = e[t.index];
  return (
    tt(n) ? (r = n) : ((r = hf(n, e, null, t)), (e[t.index] = r), eo(e, r)),
    ED(r, e, t, n),
    new Ef(r, t, e)
  );
}
function wD(t, e) {
  let r = t[ee],
    n = r.createComment(""),
    i = Fe(e, t),
    o = _a(r, i);
  return xi(r, o, n, yv(r, i), !1), n;
}
var ED = MD,
  ID = () => !1;
function bD(t, e, r) {
  return ID(t, e, r);
}
function MD(t, e, r, n) {
  if (t[Rt]) return;
  let i;
  r.type & 8 ? (i = He(n)) : (i = wD(e, r)), (t[Rt] = i);
}
function _D(t, e, r, n, i, o, s, a, u) {
  let c = e.consts,
    l = Xi(e, t, 4, s || null, wi(c, a));
  cf(e, r, l, wi(c, u)), va(e, l);
  let d = (l.tView = Oa(
    2,
    l,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function Me(t, e, r, n, i, o, s, a) {
  let u = B(),
    c = Pe(),
    l = t + ft,
    d = c.firstCreatePass ? _D(l, c, u, e, r, n, i, o, s) : c.data[l];
  or(d, !1);
  let f = SD(c, u, d, t);
  ga() && Sa(c, u, f, d), kt(f, u);
  let h = hf(f, u, f, d);
  return (
    (u[l] = h),
    eo(u, h),
    bD(h, d, u),
    da(d) && of(c, u, d),
    s != null && sf(u, d, a),
    Me
  );
}
var SD = xD;
function xD(t, e, r, n) {
  return ma(!0), e[ee].createComment("");
}
function TD(t, e, r, n, i, o) {
  let s = e.consts,
    a = wi(s, i),
    u = Xi(e, t, 2, n, a);
  return (
    cf(e, r, u, wi(s, o)),
    u.attrs !== null && Xs(u, u.attrs, !1),
    u.mergedAttrs !== null && Xs(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  );
}
function M(t, e, r, n) {
  let i = B(),
    o = Pe(),
    s = ft + t,
    a = i[ee],
    u = o.firstCreatePass ? TD(s, o, i, e, r, n) : o.data[s],
    c = AD(o, i, u, a, e, t);
  i[s] = c;
  let l = da(u);
  return (
    or(u, !0),
    Hd(a, c, u),
    (u.flags & 32) !== 32 && ga() && Sa(o, i, c, u),
    Kg() === 0 && kt(c, i),
    Jg(),
    l && (of(o, i, u), rf(o, u, i)),
    n !== null && sf(i, u),
    M
  );
}
function _() {
  let t = Ie();
  td() ? im() : ((t = t.parent), or(t, !1));
  let e = t;
  tm(e) && nm(), Xg();
  let r = Pe();
  return (
    r.firstCreatePass && (va(r, t), Hl(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      vm(e) &&
      pl(r, e, B(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      ym(e) &&
      pl(r, e, B(), e.stylesWithoutHost, !1),
    _
  );
}
function W(t, e, r, n) {
  return M(t, e, r, n), _(), W;
}
var AD = (t, e, r, n, i, o) => (ma(!0), kd(n, i, hm()));
function If() {
  return B();
}
var Pi = "en-US";
var ND = Pi;
function OD(t) {
  fg(t, "Expected localeId to be defined"),
    typeof t == "string" && (ND = t.toLowerCase().replace(/_/g, "-"));
}
function Ut(t) {
  return !!t && typeof t.then == "function";
}
function bf(t) {
  return !!t && typeof t.subscribe == "function";
}
function Ge(t, e, r, n) {
  let i = B(),
    o = Pe(),
    s = Ie();
  return FD(o, i, i[ee], s, t, e, n), Ge;
}
function RD(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Zn],
          u = i[o + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function FD(t, e, r, n, i, o, s) {
  let a = da(n),
    c = t.firstCreatePass && vy(t),
    l = e[Oe],
    d = my(e),
    f = !0;
  if (n.type & 3 || s) {
    let R = Fe(n, e),
      q = s ? s(R) : R,
      F = d.length,
      le = s ? (xe) => s(He(xe[n.index])) : n.index,
      Ye = null;
    if ((!s && a && (Ye = RD(t, e, i, n.index)), Ye !== null)) {
      let xe = Ye.__ngLastListenerFn__ || Ye;
      (xe.__ngNextListenerFn__ = o), (Ye.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Cl(n, e, l, o, !1);
      let xe = r.listen(q, i, o);
      d.push(o, xe), c && c.push(i, le, F, F + 1);
    }
  } else o = Cl(n, e, l, o, !1);
  let h = n.outputs,
    m;
  if (f && h !== null && (m = h[i])) {
    let R = m.length;
    if (R)
      for (let q = 0; q < R; q += 2) {
        let F = m[q],
          le = m[q + 1],
          ke = e[F][le].subscribe(o),
          Qe = d.length;
        d.push(o, ke), c && c.push(i, n.index, Qe, -(Qe + 1));
      }
  }
}
function Dl(t, e, r, n) {
  try {
    return Ve(6, e, r), r(n) !== !1;
  } catch (i) {
    return gf(t, i), !1;
  } finally {
    Ve(7, e, r);
  }
}
function Cl(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? gt(t.index, e) : e;
    Fa(a);
    let u = Dl(e, r, n, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (u = Dl(e, r, c, s) && u), (c = c.__ngNextListenerFn__);
    return i && u === !1 && s.preventDefault(), u;
  };
}
function Ct(t = 1) {
  return fm(t);
}
function Ht(t, e, r) {
  return Mf(t, "", e, "", r), Ht;
}
function Mf(t, e, r, n, i) {
  let o = B(),
    s = wf(o, e, r, n);
  if (s !== rt) {
    let a = Pe(),
      u = ld();
    uf(a, u, o, t, s, o[ee], i, !1);
  }
  return Mf;
}
function U(t, e = "") {
  let r = B(),
    n = Pe(),
    i = t + ft,
    o = n.firstCreatePass ? Xi(n, i, 1, e, null) : n.data[i],
    s = PD(n, r, o, e, t);
  (r[i] = s), ga() && Sa(n, r, s, o), or(o, !1);
}
var PD = (t, e, r, n, i) => (ma(!0), sv(e[ee], n));
function Ba(t) {
  return wt("", t, ""), Ba;
}
function wt(t, e, r) {
  let n = B(),
    i = wf(n, t, e, r);
  return i !== rt && mf(n, $t(), i), wt;
}
function Ua(t, e, r, n, i) {
  let o = B(),
    s = Jy(o, t, e, r, n, i);
  return s !== rt && mf(o, $t(), s), Ua;
}
function kD(t, e, r) {
  let n = Pe();
  if (n.firstCreatePass) {
    let i = ht(t);
    ia(r, n.data, n.blueprint, i, !0), ia(e, n.data, n.blueprint, i, !1);
  }
}
function ia(t, e, r, n, i) {
  if (((t = ne(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) ia(t[o], e, r, n, i);
  else {
    let o = Pe(),
      s = B(),
      a = Ie(),
      u = vn(t) ? t : ne(t.provide),
      c = Ad(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (vn(t) || !t.multi) {
      let h = new Pt(c, i, L),
        m = Cs(u, e, i ? l : l + f, d);
      m === -1
        ? (Ts(bi(a, s), o, u),
          Ds(o, t, e.length),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[m] = h), (s[m] = h));
    } else {
      let h = Cs(u, e, l + f, d),
        m = Cs(u, e, l, l + f),
        R = h >= 0 && r[h],
        q = m >= 0 && r[m];
      if ((i && !q) || (!i && !R)) {
        Ts(bi(a, s), o, u);
        let F = jD(i ? VD : LD, r.length, i, n, c);
        !i && q && (r[m].providerFactory = F),
          Ds(o, t, e.length, 0),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(F),
          s.push(F);
      } else {
        let F = _f(r[i ? m : h], c, !i && n);
        Ds(o, t, h > -1 ? h : m, F);
      }
      !i && n && q && r[m].componentProviders++;
    }
  }
}
function Ds(t, e, r, n) {
  let i = vn(e),
    o = zm(e);
  if (i || o) {
    let u = (o ? ne(e.useClass) : e).prototype.ngOnDestroy;
    if (u) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = c.indexOf(r);
        l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u);
      } else c.push(r, u);
    }
  }
}
function _f(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function Cs(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function LD(t, e, r, n) {
  return oa(this.multi, []);
}
function VD(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = gn(r, r[N], this.providerFactory.index, n);
    (o = a.slice(0, s)), oa(i, o);
    for (let u = s; u < a.length; u++) o.push(a[u]);
  } else (o = []), oa(i, o);
  return o;
}
function oa(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function jD(t, e, r, n, i) {
  let o = new Pt(t, r, L);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    _f(o, i, n && !r),
    o
  );
}
function ar(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => kD(n, i ? i(t) : t, e);
  };
}
var pt = class {},
  rr = class {};
var ki = class extends pt {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Ri(this));
      let i = Vl(e);
      (this._bootstrapComponents = Rd(i.bootstrap)),
        (this._r3Injector = Nd(
          e,
          r,
          [
            { provide: pt, useValue: this },
            { provide: Qi, useValue: this.componentFactoryResolver },
            ...n,
          ],
          re(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Li = class extends rr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new ki(this.moduleType, e, []);
    }
  };
function $D(t, e, r) {
  return new ki(t, e, r);
}
var sa = class extends pt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Ri(this)),
      (this.instance = null);
    let r = new Xn(
      [
        ...e.providers,
        { provide: pt, useValue: this },
        { provide: Qi, useValue: this.componentFactoryResolver },
      ],
      e.parent || Ea(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function to(t, e, r = null) {
  return new sa({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var BD = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = Sd(!1, n.type),
          o =
            i.length > 0
              ? to([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = y({
    token: e,
    providedIn: "environment",
    factory: () => new e(D(ge)),
  });
  let t = e;
  return t;
})();
function Sf(t) {
  Pa("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(BD).getOrCreateStandaloneInjector(t));
}
var no = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = zD;
    let t = e;
    return t;
  })(),
  UD = no,
  HD = class extends UD {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = mD(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new Lt(i);
    }
  };
function zD() {
  return GD(Ie(), B());
}
function GD(t, e) {
  return t.type & 4 ? new HD(e, t, Ki(t, e)) : null;
}
var li = null;
function WD(t) {
  (li !== null &&
    (t.defaultEncapsulation !== li.defaultEncapsulation ||
      t.preserveWhitespaces !== li.preserveWhitespaces)) ||
    (li = t);
}
var ro = (() => {
    let e = class e {
      log(n) {
        console.log(n);
      }
      warn(n) {
        console.warn(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  aa = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  io = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Li(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = Vl(n),
          s = Rd(o.declarations).reduce((a, u) => {
            let c = dt(u);
            return c && a.push(new yn(c)), a;
          }, []);
        return new aa(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  qD = new C("compilerOptions");
var oo = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new X(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Ha = new C(""),
  ur = new C(""),
  so = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._didWork = !1),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          za || (ZD(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            (this._didWork = !0), (this._isZoneStable = !1);
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                $.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (
          (this._pendingCount += 1), (this._didWork = !0), this._pendingCount
        );
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb(this._didWork);
            }
            this._didWork = !1;
          });
        else {
          let n = this.getPendingTasks();
          (this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          )),
            (this._didWork = !0);
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n(this._didWork, this.getPendingTasks());
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: o });
      }
      whenStable(n, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D($), D(ao), D(ur));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ao = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return za?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function ZD(t) {
  za = t;
}
var za,
  uo = new C("Application Initializer"),
  xf = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = p(uo, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (Ut(s)) n.push(s);
          else if (bf(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ga = new C("appBootstrapListener");
function YD(t, e, r) {
  let n = new Li(r);
  return Promise.resolve(n);
}
function QD() {
  hc(() => {
    throw new v(600, !1);
  });
}
function KD(t) {
  return t.isBoundToModule;
}
function JD(t, e, r) {
  try {
    let n = r();
    return Ut(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function Tf(t, e) {
  return Array.isArray(e) ? e.reduce(Tf, t) : g(g({}, t), e);
}
var Mn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Kd)),
        (this.afterRenderEffectManager = p(Va)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(oo).hasPendingTasks.pipe(A((n) => !n))),
        (this._injector = p(ge));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof Ai;
      if (!this._injector.get(xf).done) {
        let h = !o && Ll(n),
          m = !1;
        throw new v(405, m);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Qi).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let u = KD(a) ? void 0 : this._injector.get(pt),
        c = i || a.selector,
        l = a.create(be.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Ha, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            gi(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      if (this._runningTick) throw new v(101, !1);
      try {
        this._runningTick = !0;
        for (let n of this._views) n.detectChanges();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        try {
          let n = this.afterRenderEffectManager.execute();
        } catch (n) {
          this.internalErrorHandler(n);
        }
        this._runningTick = !1;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      gi(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Ga, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => gi(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function gi(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function wl(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var XD = (() => {
  let e = class e {
    constructor() {
      (this.zone = p($)), (this.applicationRef = p(Mn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function e0(t) {
  return [
    { provide: $, useFactory: t },
    {
      provide: mn,
      multi: !0,
      useFactory: () => {
        let e = p(XD, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: mn,
      multi: !0,
      useFactory: () => {
        let e = p(r0);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Kd, useFactory: t0 },
  ];
}
function t0() {
  let t = p($),
    e = p(ze);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function n0(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var r0 = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new Q()),
        (this.initialized = !1),
        (this.zone = p($)),
        (this.pendingTasks = p(oo));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              $.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            $.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function i0() {
  return (typeof $localize < "u" && $localize.locale) || Pi;
}
var Wa = new C("LocaleId", {
  providedIn: "root",
  factory: () => p(Wa, S.Optional | S.SkipSelf) || i0(),
});
var Af = new C("PlatformDestroyListeners"),
  Nf = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let o = Ry(
          i?.ngZone,
          n0({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = $D(
              n.moduleType,
              this.injector,
              e0(() => o)
            ),
            a = s.injector.get(ze, null);
          return (
            o.runOutsideAngular(() => {
              let u = o.onError.subscribe({
                next: (c) => {
                  a.handleError(c);
                },
              });
              s.onDestroy(() => {
                gi(this._modules, s), u.unsubscribe();
              });
            }),
            JD(a, o, () => {
              let u = s.injector.get(xf);
              return (
                u.runInitializers(),
                u.donePromise.then(() => {
                  let c = s.injector.get(Wa, Pi);
                  return OD(c || Pi), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let o = Tf({}, i);
        return YD(this.injector, o, n).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(Mn);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new v(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new v(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(Af, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(be));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  zn = null,
  Of = new C("AllowMultipleToken");
function o0(t) {
  if (zn && !zn.get(Of, !1)) throw new v(400, !1);
  QD(), (zn = t);
  let e = t.get(Nf);
  return u0(t), e;
}
function qa(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new C(n);
  return (o = []) => {
    let s = Rf();
    if (!s || s.injector.get(Of, !1)) {
      let a = [...r, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : o0(s0(a, n));
    }
    return a0(i);
  };
}
function s0(t = [], e) {
  return be.create({
    name: e,
    providers: [
      { provide: Wi, useValue: "platform" },
      { provide: Af, useValue: new Set([() => (zn = null)]) },
      ...t,
    ],
  });
}
function a0(t) {
  let e = Rf();
  if (!e) throw new v(401, !1);
  return e;
}
function Rf() {
  return zn?.get(Nf) ?? null;
}
function u0(t) {
  t.get(Ia, null)?.forEach((r) => r());
}
var Ff = qa(null, "core", []),
  Pf = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Mn));
    }),
      (e.ɵmod = oe({ type: e })),
      (e.ɵinj = ie({}));
    let t = e;
    return t;
  })();
function co(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function kf(t) {
  let e = dt(t);
  if (!e) return null;
  let r = new yn(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var Za = null;
function We() {
  return Za;
}
function Bf(t) {
  Za || (Za = t);
}
var lo = class {},
  ae = new C("DocumentToken"),
  eu = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(d0))(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })(),
  Uf = new C("Location Initialized"),
  d0 = (() => {
    let e = class e extends eu {
      constructor() {
        super(),
          (this._doc = p(ae)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return We().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = We().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = We().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => new e())(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function tu(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function Lf(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function it(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var zt = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(nu))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  Hf = new C("appBaseHref"),
  nu = (() => {
    let e = class e extends zt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(ae).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return tu(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + it(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + it(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + it(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(eu), D(Hf, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  zf = (() => {
    let e = class e extends zt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash;
        return i == null && (i = "#"), i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = tu(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + it(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + it(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(eu), D(Hf, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _n = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new K()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = p0(Lf(Vf(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + it(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(h0(this._basePath, Vf(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + it(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + it(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          this._urlChangeSubscription ||
            (this._urlChangeSubscription = this.subscribe((i) => {
              this._notifyUrlChangeListeners(i.url, i.state);
            })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = it),
      (e.joinWithSlash = tu),
      (e.stripTrailingSlash = Lf),
      (e.ɵfac = function (i) {
        return new (i || e)(D(zt));
      }),
      (e.ɵprov = y({ token: e, factory: () => f0(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function f0() {
  return new _n(D(zt));
}
function h0(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Vf(t) {
  return t.replace(/\/index.html$/, "");
}
function p0(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function Gf(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Ya = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  ho = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (!1)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Ya(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let u = i.get(s);
            i.move(u, a), jf(u, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let u = i.get(o).context;
          (u.index = o), (u.count = s), (u.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          jf(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(bn), L(no), L(Na));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function jf(t, e) {
  t.context.$implicit = e.item;
}
var Wf = (() => {
    let e = class e {
      constructor(n, i) {
        (this._viewContainer = n),
          (this._context = new Qa()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        $f("ngIfThen", n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        $f("ngIfElse", n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(bn), L(no));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Qa = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function $f(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${re(e)}'.`);
}
var qf = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = oe({ type: e })),
      (e.ɵinj = ie({}));
    let t = e;
    return t;
  })(),
  ru = "browser",
  g0 = "server";
function m0(t) {
  return t === ru;
}
function iu(t) {
  return t === g0;
}
var Zf = (() => {
    let e = class e {};
    e.ɵprov = y({
      token: e,
      providedIn: "root",
      factory: () => (m0(p(vt)) ? new Ka(p(ae), window) : new Ja()),
    });
    let t = e;
    return t;
  })(),
  Ka = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = v0(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function v0(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var Ja = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  fo = class {};
var au = class extends lo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  uu = class t extends au {
    static makeCurrent() {
      Bf(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = D0();
      return r == null ? null : C0(r);
    }
    resetBaseElement() {
      cr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Gf(document.cookie, e);
    }
  },
  cr = null;
function D0() {
  return (
    (cr = cr || document.querySelector("base")),
    cr ? cr.getAttribute("href") : null
  );
}
function C0(t) {
  return new URL(t, document.baseURI).pathname;
}
var cu = class {
    addToWindow(e) {
      (pe.getAngularTestability = (n, i = !0) => {
        let o = e.findTestabilityInTree(n, i);
        if (o == null) throw new v(5103, !1);
        return o;
      }),
        (pe.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (pe.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = pe.getAllAngularTestabilities(),
          o = i.length,
          s = !1,
          a = function (u) {
            (s = s || u), o--, o == 0 && n(s);
          };
        i.forEach((u) => {
          u.whenStable(a);
        });
      };
      pe.frameworkStabilizers || (pe.frameworkStabilizers = []),
        pe.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? We().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  w0 = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  lu = new C("EventManagerPlugins"),
  Xf = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new v(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(lu), D($));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  po = class {
    constructor(e) {
      this._doc = e;
    }
  },
  ou = "ng-app-id",
  eh = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = iu(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${ou}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(ou), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(ou, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(ae), D(qi), D(ba, 8), D(vt));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  su = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  fu = /%COMP%/g,
  th = "%COMP%",
  E0 = `_nghost-${th}`,
  I0 = `_ngcontent-${th}`,
  b0 = !0,
  M0 = new C("RemoveStylesOnCompDestroy", {
    providedIn: "root",
    factory: () => b0,
  });
function _0(t) {
  return I0.replace(fu, t);
}
function S0(t) {
  return E0.replace(fu, t);
}
function nh(t, e) {
  return e.map((r) => r.replace(fu, t));
}
var Qf = (() => {
    let e = class e {
      constructor(n, i, o, s, a, u, c, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = iu(u)),
          (this.defaultRenderer = new lr(n, a, c, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === $e.ShadowDom &&
          (i = j(g({}, i), { encapsulation: $e.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof go
            ? o.applyToHost(n)
            : o instanceof dr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case $e.Emulated:
              s = new go(c, l, i, this.appId, d, a, u, f);
              break;
            case $e.ShadowDom:
              return new du(c, l, n, i, a, u, this.nonce, f);
            default:
              s = new dr(c, l, i, d, a, u, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        D(Xf),
        D(eh),
        D(qi),
        D(M0),
        D(ae),
        D(vt),
        D($),
        D(ba)
      );
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  lr = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(su[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (Kf(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (Kf(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new v(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = su[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = su[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (Xe.DashCase | Xe.Important)
        ? e.style.setProperty(r, n, i & Xe.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & Xe.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = We().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function Kf(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var du = class extends lr {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, u),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = nh(i.id, i.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  dr = class extends lr {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? nh(u, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  go = class extends dr {
    constructor(e, r, n, i, o, s, a, u) {
      let c = i + "-" + n.id;
      super(e, r, n, o, s, a, u, c),
        (this.contentAttr = _0(c)),
        (this.hostAttr = S0(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  x0 = (() => {
    let e = class e extends po {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(ae));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Jf = ["alt", "control", "meta", "shift"],
  T0 = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  A0 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  N0 = (() => {
    let e = class e extends po {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => We().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          u = i.indexOf("code");
        if (
          (u > -1 && (i.splice(u, 1), (a = "code.")),
          Jf.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(n, i) {
        let o = T0[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Jf.forEach((a) => {
                if (a !== o) {
                  let u = A0[a];
                  u(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(ae));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function O0() {
  uu.makeCurrent();
}
function R0() {
  return new ze();
}
function F0() {
  return Od(document), document;
}
var P0 = [
    { provide: vt, useValue: ru },
    { provide: Ia, useValue: O0, multi: !0 },
    { provide: ae, useFactory: F0, deps: [] },
  ],
  rh = qa(Ff, "browser", P0),
  k0 = new C(""),
  L0 = [
    { provide: ur, useClass: cu, deps: [] },
    { provide: Ha, useClass: so, deps: [$, ao, ur] },
    { provide: so, useClass: so, deps: [$, ao, ur] },
  ],
  V0 = [
    { provide: Wi, useValue: "root" },
    { provide: ze, useFactory: R0, deps: [] },
    { provide: lu, useClass: x0, multi: !0, deps: [ae, $, vt] },
    { provide: lu, useClass: N0, multi: !0, deps: [ae] },
    Qf,
    eh,
    Xf,
    { provide: er, useExisting: Qf },
    { provide: fo, useClass: w0, deps: [] },
    [],
  ],
  ih = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: qi, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(k0, 12));
    }),
      (e.ɵmod = oe({ type: e })),
      (e.ɵinj = ie({ providers: [...V0, ...L0], imports: [qf, Pf] }));
    let t = e;
    return t;
  })();
function j0() {
  return new hu(D(ae));
}
var hu = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(ae));
  }),
    (e.ɵprov = y({
      token: e,
      factory: function (i) {
        let o = null;
        return i ? (o = new i()) : (o = j0()), o;
      },
      providedIn: "root",
    }));
  let t = e;
  return t;
})();
var b = "primary",
  _r = Symbol("RouteTitle"),
  yu = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Nn(t) {
  return new yu(t);
}
function B0(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function U0(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!qe(t[r], e[r])) return !1;
  return !0;
}
function qe(t, e) {
  let r = t ? Du(t) : void 0,
    n = e ? Du(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !ph(t[i], e[i]))) return !1;
  return !0;
}
function Du(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function ph(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function Mt(t) {
  return es(t) ? t : Ut(t) ? H(Promise.resolve(t)) : w(t);
}
var H0 = { exact: mh, subset: vh },
  gh = { exact: z0, subset: G0, ignored: () => !0 };
function sh(t, e, r) {
  return (
    H0[r.paths](t.root, e.root, r.matrixParams) &&
    gh[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function z0(t, e) {
  return qe(t, e);
}
function mh(t, e, r) {
  if (
    !Wt(t.segments, e.segments) ||
    !yo(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !mh(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function G0(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => ph(t[r], e[r]))
  );
}
function vh(t, e, r) {
  return yh(t, e, e.segments, r);
}
function yh(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!Wt(i, r) || e.hasChildren() || !yo(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!Wt(t.segments, r) || !yo(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !vh(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !Wt(t.segments, i) || !yo(t.segments, i, n) || !t.children[b]
      ? !1
      : yh(t.children[b], e, o, n);
  }
}
function yo(t, e, r) {
  return e.every((n, i) => gh[r](t[i].parameters, n.parameters));
}
var Et = class {
    constructor(e = new k([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Nn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      return Z0.serialize(this);
    }
  },
  k = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Do(this);
    }
  },
  Gt = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (
        this._parameterMap || (this._parameterMap = Nn(this.parameters)),
        this._parameterMap
      );
    }
    toString() {
      return Ch(this);
    }
  };
function W0(t, e) {
  return Wt(t, e) && t.every((r, n) => qe(r.parameters, e[n].parameters));
}
function Wt(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function q0(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === b && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== b && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var Sr = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => new yr())(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  yr = class {
    parse(e) {
      let r = new wu(e);
      return new Et(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${fr(e.root, !0)}`,
        n = K0(e.queryParams),
        i = typeof e.fragment == "string" ? `#${Y0(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  Z0 = new yr();
function Do(t) {
  return t.segments.map((e) => Ch(e)).join("/");
}
function fr(t, e) {
  if (!t.hasChildren()) return Do(t);
  if (e) {
    let r = t.children[b] ? fr(t.children[b], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== b && n.push(`${i}:${fr(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = q0(t, (n, i) =>
      i === b ? [fr(t.children[b], !1)] : [`${i}:${fr(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[b] != null
      ? `${Do(t)}/${r[0]}`
      : `${Do(t)}/(${r.join("//")})`;
  }
}
function Dh(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function mo(t) {
  return Dh(t).replace(/%3B/gi, ";");
}
function Y0(t) {
  return encodeURI(t);
}
function Cu(t) {
  return Dh(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Co(t) {
  return decodeURIComponent(t);
}
function ah(t) {
  return Co(t.replace(/\+/g, "%20"));
}
function Ch(t) {
  return `${Cu(t.path)}${Q0(t.parameters)}`;
}
function Q0(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${Cu(e)}=${Cu(r)}`)
    .join("");
}
function K0(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${mo(r)}=${mo(i)}`).join("&")
        : `${mo(r)}=${mo(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var J0 = /^[^\/()?;#]+/;
function pu(t) {
  let e = t.match(J0);
  return e ? e[0] : "";
}
var X0 = /^[^\/()?;=#]+/;
function eC(t) {
  let e = t.match(X0);
  return e ? e[0] : "";
}
var tC = /^[^=?&#]+/;
function nC(t) {
  let e = t.match(tC);
  return e ? e[0] : "";
}
var rC = /^[^&#]+/;
function iC(t) {
  let e = t.match(rC);
  return e ? e[0] : "";
}
var wu = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new k([], {})
        : new k([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[b] = new k(e, r)),
      n
    );
  }
  parseSegment() {
    let e = pu(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(e), new Gt(Co(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = eC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = pu(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[Co(r)] = Co(n);
  }
  parseQueryParam(e) {
    let r = nC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = iC(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = ah(r),
      o = ah(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = pu(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new v(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = b);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[b] : new k([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new v(4011, !1);
  }
};
function wh(t) {
  return t.segments.length > 0 ? new k([], { [b]: t }) : t;
}
function Eh(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Eh(i);
    if (n === b && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new k(t.segments, e);
  return oC(r);
}
function oC(t) {
  if (t.numberOfChildren === 1 && t.children[b]) {
    let e = t.children[b];
    return new k(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function On(t) {
  return t instanceof Et;
}
function sC(t, e, r = null, n = null) {
  let i = Ih(t);
  return bh(i, e, r, n);
}
function Ih(t) {
  let e;
  function r(o) {
    let s = {};
    for (let u of o.children) {
      let c = r(u);
      s[u.outlet] = c;
    }
    let a = new k(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = wh(n);
  return e ?? i;
}
function bh(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return gu(i, i, i, r, n);
  let o = aC(e);
  if (o.toRoot()) return gu(i, i, new k([], {}), r, n);
  let s = uC(o, i, t),
    a = s.processChildren
      ? gr(s.segmentGroup, s.index, o.commands)
      : _h(s.segmentGroup, s.index, o.commands);
  return gu(i, s.segmentGroup, a, r, n);
}
function wo(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Dr(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function gu(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([u, c]) => {
      o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
    });
  let s;
  t === e ? (s = r) : (s = Mh(t, e, r));
  let a = wh(Eh(s));
  return new Et(a, o, i);
}
function Mh(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Mh(o, e, r));
    }),
    new k(t.segments, n)
  );
}
var Eo = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && wo(n[0]))
    )
      throw new v(4003, !1);
    let i = n.find(Dr);
    if (i && i !== n.at(-1)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function aC(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Eo(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([u, c]) => {
              a[u] = typeof c == "string" ? c.split("/") : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, u) => {
            (u == 0 && a === ".") ||
              (u == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Eo(r, e, n);
}
var Tn = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function uC(t, e, r) {
  if (t.isAbsolute) return new Tn(e, !0, 0);
  if (!r) return new Tn(e, !1, NaN);
  if (r.parent === null) return new Tn(r, !0, 0);
  let n = wo(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return cC(r, i, t.numberOfDoubleDots);
}
function cC(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new v(4005, !1);
    i = n.segments.length;
  }
  return new Tn(n, !1, i - o);
}
function lC(t) {
  return Dr(t[0]) ? t[0].outlets : { [b]: t };
}
function _h(t, e, r) {
  if ((t || (t = new k([], {})), t.segments.length === 0 && t.hasChildren()))
    return gr(t, e, r);
  let n = dC(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new k(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[b] = new k(t.segments.slice(n.pathIndex), t.children)),
      gr(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new k(t.segments, {})
      : n.match && !t.hasChildren()
      ? Eu(t, e, r)
      : n.match
      ? gr(t, 0, i)
      : Eu(t, e, r);
}
function gr(t, e, r) {
  if (r.length === 0) return new k(t.segments, {});
  {
    let n = lC(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== b) &&
      t.children[b] &&
      t.numberOfChildren === 1 &&
      t.children[b].segments.length === 0
    ) {
      let o = gr(t.children[b], e, r);
      return new k(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = _h(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new k(t.segments, i)
    );
  }
}
function dC(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (Dr(a)) break;
    let u = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && u === void 0) break;
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!ch(u, c, s)) return o;
      n += 2;
    } else {
      if (!ch(u, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Eu(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (Dr(o)) {
      let u = fC(o.outlets);
      return new k(n, u);
    }
    if (i === 0 && wo(r[0])) {
      let u = t.segments[e];
      n.push(new Gt(u.path, uh(r[0]))), i++;
      continue;
    }
    let s = Dr(o) ? o.outlets[b] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && wo(a)
      ? (n.push(new Gt(s, uh(a))), (i += 2))
      : (n.push(new Gt(s, {})), i++);
  }
  return new k(n, {});
}
function fC(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = Eu(new k([], {}), 0, n));
    }),
    e
  );
}
function uh(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function ch(t, e, r) {
  return t == r.path && qe(e, r.parameters);
}
var mr = "imperative",
  Se = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  Rn = class extends Se {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = 0),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  ot = class extends Se {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = 1);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  It = class extends Se {
    constructor(e, r, n, i) {
      super(e, r), (this.reason = n), (this.code = i), (this.type = 2);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  bt = class extends Se {
    constructor(e, r, n, i) {
      super(e, r), (this.reason = n), (this.code = i), (this.type = 16);
    }
  },
  Cr = class extends Se {
    constructor(e, r, n, i) {
      super(e, r), (this.error = n), (this.target = i), (this.type = 3);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Io = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = 4);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Iu = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = 7);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  bu = class extends Se {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = 8);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Mu = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = 5);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  _u = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = 6);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Su = class {
    constructor(e) {
      (this.route = e), (this.type = 9);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  xu = class {
    constructor(e) {
      (this.route = e), (this.type = 10);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Tu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 11);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Au = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 12);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Nu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 13);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ou = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 14);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  bo = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = 15);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  wr = class {},
  Er = class {
    constructor(e) {
      this.url = e;
    }
  };
var Ru = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new xr()),
        (this.attachRef = null);
    }
  },
  xr = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new Ru()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Mo = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Fu(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Fu(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Pu(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Pu(e, this._root).map((r) => r.value);
    }
  };
function Fu(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Fu(t, r);
    if (n) return n;
  }
  return null;
}
function Pu(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Pu(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var me = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function xn(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var _o = class extends Mo {
  constructor(e, r) {
    super(e), (this.snapshot = r), Gu(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Sh(t) {
  let e = hC(t),
    r = new X([new Gt("", {})]),
    n = new X({}),
    i = new X({}),
    o = new X({}),
    s = new X(""),
    a = new Fn(r, n, o, s, i, b, t, e.root);
  return (a.snapshot = e.root), new _o(new me(a, []), e);
}
function hC(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Ir([], e, n, i, r, b, t, null, {});
  return new So("", new me(o, []));
}
var Fn = class {
  constructor(e, r, n, i, o, s, a, u) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(A((c) => c[_r])) ?? w(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      this._paramMap || (this._paramMap = this.params.pipe(A((e) => Nn(e)))),
      this._paramMap
    );
  }
  get queryParamMap() {
    return (
      this._queryParamMap ||
        (this._queryParamMap = this.queryParams.pipe(A((e) => Nn(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function zu(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    i && Th(i) && (n.resolve[_r] = i.title),
    n
  );
}
var Ir = class {
    get title() {
      return this.data?.[_r];
    }
    constructor(e, r, n, i, o, s, a, u, c) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (
        this._paramMap || (this._paramMap = Nn(this.params)), this._paramMap
      );
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Nn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  So = class extends Mo {
    constructor(e, r) {
      super(r), (this.url = e), Gu(this, r);
    }
    toString() {
      return xh(this._root);
    }
  };
function Gu(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => Gu(t, r));
}
function xh(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(xh).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function mu(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      qe(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      qe(e.params, r.params) || t.paramsSubject.next(r.params),
      U0(e.url, r.url) || t.urlSubject.next(r.url),
      qe(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function ku(t, e) {
  let r = qe(t.params, e.params) && W0(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || ku(t.parent, e.parent));
}
function Th(t) {
  return typeof t.title == "string" || t.title === null;
}
var pC = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = b),
          (this.activateEvents = new K()),
          (this.deactivateEvents = new K()),
          (this.attachEvents = new K()),
          (this.detachEvents = new K()),
          (this.parentContexts = p(xr)),
          (this.location = p(bn)),
          (this.changeDetector = p(In)),
          (this.environmentInjector = p(ge)),
          (this.inputBinder = p(Oo, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Lu(n, u, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [wn],
      }));
    let t = e;
    return t;
  })(),
  Lu = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === Fn
        ? this.route
        : e === xr
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  Oo = new C(""),
  lh = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = Bn([i.queryParams, i.params, i.data])
            .pipe(
              De(
                ([s, a, u], c) => (
                  (u = g(g(g({}, s), a), u)),
                  c === 0 ? w(u) : Promise.resolve(u)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = kf(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: u } of a.inputs)
                n.activatedComponentRef.setInput(u, s[u]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function gC(t, e, r) {
  let n = br(t, e._root, r ? r._root : void 0);
  return new _o(n, e);
}
function br(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = mC(t, e, r);
    return new me(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => br(t, a))),
          s
        );
      }
    }
    let n = vC(e.value),
      i = e.children.map((o) => br(t, o));
    return new me(n, i);
  }
}
function mC(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return br(t, n, i);
    return br(t, n);
  });
}
function vC(t) {
  return new Fn(
    new X(t.url),
    new X(t.params),
    new X(t.queryParams),
    new X(t.fragment),
    new X(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Ah = "ngNavigationCancelingError";
function Nh(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = On(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Oh(!1, 0, e);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Oh(t, e, r) {
  let n = new Error("NavigationCancelingError: " + (t || ""));
  return (n[Ah] = !0), (n.cancellationCode = e), r && (n.url = r), n;
}
function yC(t) {
  return Rh(t) && On(t.url);
}
function Rh(t) {
  return t && t[Ah];
}
var DC = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Sf],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && W(0, "router-outlet");
      },
      dependencies: [pC],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function CC(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = to(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Wu(t) {
  let e = t.children && t.children.map(Wu),
    r = e ? j(g({}, t), { children: e }) : g({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== b &&
      (r.component = DC),
    r
  );
}
function Ze(t) {
  return t.outlet || b;
}
function wC(t, e) {
  let r = t.filter((n) => Ze(n) === e);
  return r.push(...t.filter((n) => Ze(n) !== e)), r;
}
function Tr(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var EC = (t, e, r, n) =>
    A(
      (i) => (
        new Vu(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Vu = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        mu(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = xn(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = xn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = xn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = xn(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new Ou(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Au(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((mu(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            mu(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Tr(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  xo = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  An = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function IC(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return hr(n, i, r, [n.value]);
}
function bC(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function kn(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Ml(t) ? t : e.get(t)) : n;
}
function hr(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = xn(e);
  return (
    t.children.forEach((s) => {
      MC(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => vr(a, r.getContext(s), i)),
    i
  );
}
function MC(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let u = _C(s, o, o.routeConfig.runGuardsAndResolvers);
    u
      ? i.canActivateChecks.push(new xo(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? hr(t, e, a ? a.children : null, n, i) : hr(t, e, r, n, i),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new An(a.outlet.component, s));
  } else
    s && vr(e, a, i),
      i.canActivateChecks.push(new xo(n)),
      o.component
        ? hr(t, null, a ? a.children : null, n, i)
        : hr(t, null, r, n, i);
  return i;
}
function _C(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !Wt(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !Wt(t.url, e.url) || !qe(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !ku(t, e) || !qe(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !ku(t, e);
  }
}
function vr(t, e, r) {
  let n = xn(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? vr(s, e.children.getContext(o), r)
        : vr(s, null, r)
      : vr(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new An(e.outlet.component, i))
        : r.canDeactivateChecks.push(new An(null, i))
      : r.canDeactivateChecks.push(new An(null, i));
}
function Ar(t) {
  return typeof t == "function";
}
function SC(t) {
  return typeof t == "boolean";
}
function xC(t) {
  return t && Ar(t.canLoad);
}
function TC(t) {
  return t && Ar(t.canActivate);
}
function AC(t) {
  return t && Ar(t.canActivateChild);
}
function NC(t) {
  return t && Ar(t.canDeactivate);
}
function OC(t) {
  return t && Ar(t.canMatch);
}
function Fh(t) {
  return t instanceof Ke || t?.name === "EmptyError";
}
var vo = Symbol("INITIAL_VALUE");
function Pn() {
  return De((t) =>
    Bn(t.map((e) => e.pipe(Je(1), os(vo)))).pipe(
      A((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === vo) return vo;
            if (r === !1 || r instanceof Et) return r;
          }
        return !0;
      }),
      ye((e) => e !== vo),
      Je(1)
    )
  );
}
function RC(t, e) {
  return Y((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? w(j(g({}, r), { guardsResult: !0 }))
      : FC(s, n, i, t).pipe(
          Y((a) => (a && SC(a) ? PC(n, o, t, e) : w(a))),
          A((a) => j(g({}, r), { guardsResult: a }))
        );
  });
}
function FC(t, e, r, n) {
  return H(t).pipe(
    Y((i) => $C(i.component, i.route, r, e, n)),
    Le((i) => i !== !0, !0)
  );
}
function PC(t, e, r, n) {
  return H(e).pipe(
    Tt((i) =>
      rn(
        LC(i.route.parent, n),
        kC(i.route, n),
        jC(t, i.path, r),
        VC(t, i.route, r)
      )
    ),
    Le((i) => i !== !0, !0)
  );
}
function kC(t, e) {
  return t !== null && e && e(new Nu(t)), w(!0);
}
function LC(t, e) {
  return t !== null && e && e(new Tu(t)), w(!0);
}
function VC(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return w(!0);
  let i = n.map((o) =>
    ii(() => {
      let s = Tr(e) ?? r,
        a = kn(o, s),
        u = TC(a) ? a.canActivate(e, t) : mt(s, () => a(e, t));
      return Mt(u).pipe(Le());
    })
  );
  return w(i).pipe(Pn());
}
function jC(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => bC(s))
      .filter((s) => s !== null)
      .map((s) =>
        ii(() => {
          let a = s.guards.map((u) => {
            let c = Tr(s.node) ?? r,
              l = kn(u, c),
              d = AC(l) ? l.canActivateChild(n, t) : mt(c, () => l(n, t));
            return Mt(d).pipe(Le());
          });
          return w(a).pipe(Pn());
        })
      );
  return w(o).pipe(Pn());
}
function $C(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return w(!0);
  let s = o.map((a) => {
    let u = Tr(e) ?? i,
      c = kn(a, u),
      l = NC(c) ? c.canDeactivate(t, e, r, n) : mt(u, () => c(t, e, r, n));
    return Mt(l).pipe(Le());
  });
  return w(s).pipe(Pn());
}
function BC(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return w(!0);
  let o = i.map((s) => {
    let a = kn(s, t),
      u = xC(a) ? a.canLoad(e, r) : mt(t, () => a(e, r));
    return Mt(u);
  });
  return w(o).pipe(Pn(), Ph(n));
}
function Ph(t) {
  return Qo(
    J((e) => {
      if (On(e)) throw Nh(t, e);
    }),
    A((e) => e === !0)
  );
}
function UC(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return w(!0);
  let o = i.map((s) => {
    let a = kn(s, t),
      u = OC(a) ? a.canMatch(e, r) : mt(t, () => a(e, r));
    return Mt(u);
  });
  return w(o).pipe(Pn(), Ph(n));
}
var Mr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  To = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Sn(t) {
  return tn(new Mr(t));
}
function HC(t) {
  return tn(new v(4e3, !1));
}
function zC(t) {
  return tn(Oh(!1, 3));
}
var ju = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return w(n);
        if (i.numberOfChildren > 1 || !i.children[b]) return HC(e.redirectTo);
        i = i.children[b];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new To(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new Et(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(e, u, n, i);
        }),
        new k(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new v(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  $u = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function GC(t, e, r, n, i) {
  let o = qu(t, e, r);
  return o.matched
    ? ((n = CC(e, n)),
      UC(n, e, r, i).pipe(A((s) => (s === !0 ? o : g({}, $u)))))
    : w(o);
}
function qu(t, e, r) {
  if (e.path === "**") return WC(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, $u)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || B0)(r, t, e);
  if (!i) return g({}, $u);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
    o[a] = u.path;
  });
  let s =
    i.consumed.length > 0
      ? g(g({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function WC(t) {
  return {
    matched: !0,
    parameters: t.at(-1)?.parameters ?? {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function dh(t, e, r, n) {
  return r.length > 0 && YC(t, r, n)
    ? {
        segmentGroup: new k(e, ZC(n, new k(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && QC(t, r, n)
    ? {
        segmentGroup: new k(t.segments, qC(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new k(t.segments, t.children), slicedSegments: r };
}
function qC(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (Ro(t, e, o) && !n[Ze(o)]) {
      let s = new k([], {});
      i[Ze(o)] = s;
    }
  return g(g({}, n), i);
}
function ZC(t, e) {
  let r = {};
  r[b] = e;
  for (let n of t)
    if (n.path === "" && Ze(n) !== b) {
      let i = new k([], {});
      r[Ze(n)] = i;
    }
  return r;
}
function YC(t, e, r) {
  return r.some((n) => Ro(t, e, n) && Ze(n) !== b);
}
function QC(t, e, r) {
  return r.some((n) => Ro(t, e, n));
}
function Ro(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function KC(t, e, r, n) {
  return Ze(t) !== n && (n === b || !Ro(e, r, t)) ? !1 : qu(e, t, r).matched;
}
function JC(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var Bu = class {};
function XC(t, e, r, n, i, o, s = "emptyOnly") {
  return new Uu(t, e, r, n, i, s, o).recognize();
}
var ew = 31,
  Uu = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new ju(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new v(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = dh(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        A((r) => {
          let n = new Ir(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              b,
              this.rootComponentType,
              null,
              {}
            ),
            i = new me(n, r),
            o = new So("", i),
            s = sC(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, b).pipe(
        at((n) => {
          if (n instanceof To)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Mr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = zu(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            A((o) => (o instanceof me ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return H(i).pipe(
        Tt((o) => {
          let s = n.children[o],
            a = wC(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        is((o, s) => (o.push(...s), o)),
        ut(null),
        rs(),
        Y((o) => {
          if (o === null) return Sn(n);
          let s = kh(o);
          return tw(s), w(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return H(r).pipe(
        Tt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            at((u) => {
              if (u instanceof Mr) return w(null);
              throw u;
            })
          )
        ),
        Le((a) => !!a),
        at((a) => {
          if (Fh(a)) return JC(n, i, o) ? w(new Bu()) : Sn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return KC(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : Sn(i)
        : Sn(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = qu(r, i, o);
      if (!a) return Sn(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > ew && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(Y((f) => this.processSegment(e, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = GC(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          De((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  De(({ routes: u }) => {
                    let c = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new Ir(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        rw(n),
                        Ze(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        iw(n)
                      ),
                      { segmentGroup: m, slicedSegments: R } = dh(r, l, d, u);
                    if (R.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        A((F) => (F === null ? null : new me(h, F)))
                      );
                    if (u.length === 0 && R.length === 0)
                      return w(new me(h, []));
                    let q = Ze(n) === o;
                    return this.processSegment(c, u, m, R, q ? b : o, !0).pipe(
                      A((F) => new me(h, F instanceof me ? [F] : []))
                    );
                  })
                ))
              : Sn(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? w({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? w({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : BC(e, r, n, this.urlSerializer).pipe(
              Y((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      J((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : zC(r)
              )
            )
        : w({ routes: [], injector: e });
    }
  };
function tw(t) {
  t.sort((e, r) =>
    e.value.outlet === b
      ? -1
      : r.value.outlet === b
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function nw(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function kh(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!nw(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = kh(n.children);
    e.push(new me(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function rw(t) {
  return t.data || {};
}
function iw(t) {
  return t.resolve || {};
}
function ow(t, e, r, n, i, o) {
  return Y((s) =>
    XC(t, e, r, n, s.extractedUrl, i, o).pipe(
      A(({ state: a, tree: u }) =>
        j(g({}, s), { targetSnapshot: a, urlAfterRedirects: u })
      )
    )
  );
}
function sw(t, e) {
  return Y((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return w(r);
    let o = new Set(i.map((u) => u.route)),
      s = new Set();
    for (let u of o) if (!s.has(u)) for (let c of Lh(u)) s.add(c);
    let a = 0;
    return H(s).pipe(
      Tt((u) =>
        o.has(u)
          ? aw(u, n, t, e)
          : ((u.data = zu(u, u.parent, t).resolve), w(void 0))
      ),
      J(() => a++),
      on(1),
      Y((u) => (a === s.size ? w(r) : ve))
    );
  });
}
function Lh(t) {
  let e = t.children.map((r) => Lh(r)).flat();
  return [t, ...e];
}
function aw(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Th(i) && (o[_r] = i.title),
    uw(o, t, e, n).pipe(
      A(
        (s) => (
          (t._resolvedData = s), (t.data = zu(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function uw(t, e, r, n) {
  let i = Du(t);
  if (i.length === 0) return w({});
  let o = {};
  return H(i).pipe(
    Y((s) =>
      cw(t[s], e, r, n).pipe(
        Le(),
        J((a) => {
          o[s] = a;
        })
      )
    ),
    on(1),
    ns(o),
    at((s) => (Fh(s) ? ve : tn(s)))
  );
}
function cw(t, e, r, n) {
  let i = Tr(e) ?? n,
    o = kn(t, i),
    s = o.resolve ? o.resolve(e, r) : mt(i, () => o(e, r));
  return Mt(s);
}
function vu(t) {
  return De((e) => {
    let r = t(e);
    return r ? H(r).pipe(A(() => e)) : w(e);
  });
}
var Vh = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === b));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[_r];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(lw))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  lw = (() => {
    let e = class e extends Vh {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(hu));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Nr = new C("", { providedIn: "root", factory: () => ({}) }),
  Ao = new C("ROUTES"),
  Zu = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(io));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return w(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = Mt(n.loadComponent()).pipe(
            A(jh),
            J((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            Un(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new en(i, () => new he()).pipe(Xt());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return w({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = dw(i, this.compiler, n, this.onLoadEndListener).pipe(
            Un(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new en(s, () => new he()).pipe(Xt());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function dw(t, e, r, n) {
  return Mt(t.loadChildren()).pipe(
    A(jh),
    Y((i) =>
      i instanceof rr || Array.isArray(i) ? w(i) : H(e.compileModuleAsync(i))
    ),
    A((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(Ao, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Wu), injector: o }
      );
    })
  );
}
function fw(t) {
  return t && typeof t == "object" && "default" in t;
}
function jh(t) {
  return fw(t) ? t.default : t;
}
var Yu = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(hw))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  hw = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  $h = new C(""),
  Bh = new C("");
function pw(t, e, r) {
  let n = t.get(Bh),
    i = t.get(ae);
  return t.get($).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let o,
      s = new Promise((c) => {
        o = c;
      }),
      a = i.startViewTransition(() => (o(), gw(t))),
      { onViewTransitionCreated: u } = n;
    return u && mt(t, () => u({ transition: a, from: e, to: r })), s;
  });
}
function gw(t) {
  return new Promise((e) => {
    La(e, { injector: t });
  });
}
var Qu = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new he()),
        (this.transitionAbortSubject = new he()),
        (this.configLoader = p(Zu)),
        (this.environmentInjector = p(ge)),
        (this.urlSerializer = p(Sr)),
        (this.rootContexts = p(xr)),
        (this.location = p(_n)),
        (this.inputBindingEnabled = p(Oo, { optional: !0 }) !== null),
        (this.titleStrategy = p(Vh)),
        (this.options = p(Nr, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(Yu)),
        (this.createViewTransition = p($h, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => w(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Su(o)),
        i = (o) => this.events.next(new xu(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(j(g(g({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new X({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: mr,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ye((s) => s.id !== 0),
          A((s) =>
            j(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          De((s) => {
            this.currentTransition = s;
            let a = !1,
              u = !1;
            return w(s).pipe(
              J((c) => {
                this.currentNavigation = {
                  id: c.id,
                  initialUrl: c.rawUrl,
                  extractedUrl: c.extractedUrl,
                  trigger: c.source,
                  extras: c.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? j(g({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              De((c) => {
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new bt(c.id, this.urlSerializer.serialize(c.rawUrl), f, 0)
                    ),
                    c.resolve(null),
                    ve
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return w(c).pipe(
                    De((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Rn(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? ve
                          : Promise.resolve(f)
                      );
                    }),
                    ow(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    J((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = j(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new Io(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: m,
                      restoredState: R,
                      extras: q,
                    } = c,
                    F = new Rn(f, this.urlSerializer.serialize(h), m, R);
                  this.events.next(F);
                  let le = Sh(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      j(g({}, c), {
                        targetSnapshot: le,
                        urlAfterRedirects: h,
                        extras: j(g({}, q), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    w(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new bt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        1
                      )
                    ),
                    c.resolve(null),
                    ve
                  );
                }
              }),
              J((c) => {
                let l = new Iu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                );
                this.events.next(l);
              }),
              A(
                (c) => (
                  (this.currentTransition = s =
                    j(g({}, c), {
                      guards: IC(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              RC(this.environmentInjector, (c) => this.events.next(c)),
              J((c) => {
                if (((s.guardsResult = c.guardsResult), On(c.guardsResult)))
                  throw Nh(this.urlSerializer, c.guardsResult);
                let l = new bu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                );
                this.events.next(l);
              }),
              ye((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", 3), !1)
              ),
              vu((c) => {
                if (c.guards.canActivateChecks.length)
                  return w(c).pipe(
                    J((l) => {
                      let d = new Mu(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    De((l) => {
                      let d = !1;
                      return w(l).pipe(
                        sw(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        J({
                          next: () => (d = !0),
                          complete: () => {
                            d || this.cancelNavigationTransition(l, "", 2);
                          },
                        })
                      );
                    }),
                    J((l) => {
                      let d = new _u(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              vu((c) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        J((h) => {
                          d.component = h;
                        }),
                        A(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...l(h));
                  return f;
                };
                return Bn(l(c.targetSnapshot.root)).pipe(ut(null), Je(1));
              }),
              vu(() => this.afterPreactivation()),
              De(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root
                  );
                return d ? H(d).pipe(A(() => s)) : w(s);
              }),
              A((c) => {
                let l = gC(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    j(g({}, c), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              J(() => {
                this.events.next(new wr());
              }),
              EC(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled
              ),
              Je(1),
              J({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new ot(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              ss(
                this.transitionAbortSubject.pipe(
                  J((c) => {
                    throw c;
                  })
                )
              ),
              Un(() => {
                if (!a && !u) {
                  let c = "";
                  this.cancelNavigationTransition(s, c, 1);
                }
                this.currentNavigation?.id === s.id &&
                  (this.currentNavigation = null);
              }),
              at((c) => {
                if (((u = !0), Rh(c)))
                  this.events.next(
                    new It(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    yC(c) ? this.events.next(new Er(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Cr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(c));
                  } catch (l) {
                    s.reject(l);
                  }
                }
                return ve;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new It(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function mw(t) {
  return t !== mr;
}
var vw = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(yw))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  Hu = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  yw = (() => {
    let e = class e extends Hu {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Bt(e)))(o || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Uh = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => (() => p(Dw))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  Dw = (() => {
    let e = class e extends Uh {
      constructor() {
        super(...arguments),
          (this.location = p(_n)),
          (this.urlSerializer = p(Sr)),
          (this.options = p(Nr, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(Yu)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Et()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Sh(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Rn) this.stateMemento = this.createStateMemento();
        else if (n instanceof bt) this.rawUrlTree = i.initialUrl;
        else if (n instanceof Io) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof wr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof It && (n.code === 3 || n.code === 2)
            ? this.restoreHistory(i)
            : n instanceof Cr
            ? this.restoreHistory(i, !0)
            : n instanceof ot &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = g(
            g({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Bt(e)))(o || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  pr = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(pr || {});
function Hh(t, e) {
  t.events
    .pipe(
      ye(
        (r) =>
          r instanceof ot ||
          r instanceof It ||
          r instanceof Cr ||
          r instanceof bt
      ),
      A((r) =>
        r instanceof ot || r instanceof bt
          ? pr.COMPLETE
          : (r instanceof It ? r.code === 0 || r.code === 1 : !1)
          ? pr.REDIRECTING
          : pr.FAILED
      ),
      ye((r) => r !== pr.REDIRECTING),
      Je(1)
    )
    .subscribe(() => {
      e();
    });
}
function Cw(t) {
  throw t;
}
var ww = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Ew = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  qt = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(ro)),
          (this.stateManager = p(Uh)),
          (this.options = p(Nr, { optional: !0 }) || {}),
          (this.pendingTasks = p(oo)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(Qu)),
          (this.urlSerializer = p(Sr)),
          (this.location = p(_n)),
          (this.urlHandlingStrategy = p(Yu)),
          (this._events = new he()),
          (this.errorHandler = this.options.errorHandler || Cw),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(vw)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Ao, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(Oo, { optional: !0 })),
          (this.eventsSubscription = new Q()),
          (this.isNgZoneEnabled = p($) instanceof $ && $.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof It && i.code !== 0 && i.code !== 1)
              )
                this.navigated = !0;
              else if (i instanceof ot) this.navigated = !0;
              else if (i instanceof Er) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = {
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || mw(o.source),
                  };
                this.scheduleNavigation(a, mr, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            bw(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              mr,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ||
          (this.nonRouterCurrentEntryChangeSubscription =
            this.stateManager.registerNonRouterCurrentEntryChangeListener(
              (n, i) => {
                setTimeout(() => {
                  this.navigateToSyncWithBrowser(n, "popstate", i);
                }, 0);
              }
            ));
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = g({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let u = this.parseUrl(n);
        this.scheduleNavigation(u, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Wu)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = i,
          l = c ? this.currentUrlTree.fragment : a,
          d = null;
        switch (u) {
          case "merge":
            d = g(g({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = Ih(h);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return bh(f, n, d, l ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = On(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, mr, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return Iw(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = g({}, ww)) : i === !1 ? (o = g({}, Ew)) : (o = i),
          On(n))
        )
          return sh(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return sh(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let u, c, l;
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (u = f), (c = h);
            }));
        let d = this.pendingTasks.add();
        return (
          Hh(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: u,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Iw(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new v(4008, !1);
}
function bw(t) {
  return !(t instanceof wr) && !(t instanceof Er);
}
var No = class {};
var Mw = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            ye((n) => n instanceof ot),
            Tt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = to(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            u = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(u, s.children ?? s._loadedRoutes));
        }
        return H(o).pipe(nn());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = w(null));
          let s = o.pipe(
            Y((a) =>
              a === null
                ? w(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return H([s, a]).pipe(nn());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(qt), D(io), D(ge), D(No), D(Zu));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  zh = new C(""),
  _w = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration =
            a.scrollPositionRestoration || "disabled"),
          (a.anchorScrolling = a.anchorScrolling || "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Rn
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof ot
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof bt &&
              n.code === 0 &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof bo &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new bo(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      ef();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Sw(t) {
  return t.routerState.root;
}
function Or(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function xw() {
  let t = p(be);
  return (e) => {
    let r = t.get(Mn);
    if (e !== r.components[0]) return;
    let n = t.get(qt),
      i = t.get(Gh);
    t.get(Ku) === 1 && n.initialNavigation(),
      t.get(Wh, null, S.Optional)?.setUpPreloading(),
      t.get(zh, null, S.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Gh = new C("", { factory: () => new he() }),
  Ku = new C("", { providedIn: "root", factory: () => 1 });
function Tw() {
  return Or(2, [
    { provide: Ku, useValue: 0 },
    {
      provide: uo,
      multi: !0,
      deps: [be],
      useFactory: (e) => {
        let r = e.get(Uf, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(qt),
                  o = e.get(Gh);
                Hh(i, () => {
                  n(!0);
                }),
                  (e.get(Qu).afterPreactivation = () => (
                    n(!0), o.closed ? w(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function Aw() {
  return Or(3, [
    {
      provide: uo,
      multi: !0,
      useFactory: () => {
        let e = p(qt);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Ku, useValue: 2 },
  ]);
}
var Wh = new C("");
function Nw(t) {
  return Or(0, [
    { provide: Wh, useExisting: Mw },
    { provide: No, useExisting: t },
  ]);
}
function Ow() {
  return Or(8, [lh, { provide: Oo, useExisting: lh }]);
}
function Rw(t) {
  let e = [
    { provide: $h, useValue: pw },
    {
      provide: Bh,
      useValue: g({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return Or(9, e);
}
var fh = new C("ROUTER_FORROOT_GUARD"),
  Fw = [
    _n,
    { provide: Sr, useClass: yr },
    qt,
    xr,
    { provide: Fn, useFactory: Sw, deps: [qt] },
    Zu,
    [],
  ],
  Ju = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            Fw,
            [],
            { provide: Ao, multi: !0, useValue: n },
            { provide: fh, useFactory: Vw, deps: [[qt, new Gi(), new Ca()]] },
            { provide: Nr, useValue: i || {} },
            i?.useHash ? kw() : Lw(),
            Pw(),
            i?.preloadingStrategy ? Nw(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? jw(i) : [],
            i?.bindToComponentInputs ? Ow().ɵproviders : [],
            i?.enableViewTransitions ? Rw().ɵproviders : [],
            $w(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: Ao, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(fh, 8));
    }),
      (e.ɵmod = oe({ type: e })),
      (e.ɵinj = ie({}));
    let t = e;
    return t;
  })();
function Pw() {
  return {
    provide: zh,
    useFactory: () => {
      let t = p(Zf),
        e = p($),
        r = p(Nr),
        n = p(Qu),
        i = p(Sr);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new _w(i, n, t, e, r)
      );
    },
  };
}
function kw() {
  return { provide: zt, useClass: zf };
}
function Lw() {
  return { provide: zt, useClass: nu };
}
function Vw(t) {
  return "guarded";
}
function jw(t) {
  return [
    t.initialNavigation === "disabled" ? Aw().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? Tw().ɵproviders : [],
  ];
}
var hh = new C("");
function $w() {
  return [
    { provide: hh, useFactory: xw },
    { provide: Ga, multi: !0, useExisting: hh },
  ];
}
var Bw = [],
  qh = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = oe({ type: e })),
      (e.ɵinj = ie({ imports: [Ju.forRoot(Bw), Ju] }));
    let t = e;
    return t;
  })();
var Ln = [
  {
    id: 1,
    firstname: "Manu",
    name: "Faure",
    activity: "Open to work",
    picture:
      "https://www.wwf.fr/sites/default/files/styles/page_cover_large_16_9/public/2017-05/279168-min.jpg?h=818ea07f&itok=vF2ILljB",
  },
  {
    id: 2,
    firstname: "G\xE9raldine",
    name: "Mourlon",
    activity: "Worker",
    picture:
      "https://ecoles-rpi-broualan-trans.ac-rennes.fr/sites/ecoles-rpi-broualan-trans.ac-rennes.fr/local/cache-vignettes/L400xH340/amour_leopard-b6080-c4230.jpg?1703699048",
  },
  {
    id: 3,
    firstname: "Lili",
    name: "Faure",
    activity: "College",
    picture:
      "https://static.actu.fr/uploads/2023/06/adobestock-206778229-960x640.jpeg",
  },
  {
    id: 4,
    firstname: "Charlie",
    name: "Faure",
    activity: "Primary school",
    picture:
      "https://sosmissdolittle.com/wp-content/uploads/2020/02/IMG_1257.jpg",
  },
];
function Uw(t, e) {
  if (
    (t & 1 &&
      (M(0, "div", 5)(1, "p", 6),
      U(2),
      _(),
      W(3, "img", 11),
      M(4, "p"),
      U(5),
      _()()),
    t & 2)
  ) {
    let r = e.$implicit;
    z(2),
      Ua("", r.firstname, " ", r.name, ""),
      z(),
      Ht("src", r.picture, En),
      z(2),
      Ba(r.activity);
  }
}
var Zh = (() => {
  let e = class e {
    constructor() {
      this.familyData = Ln;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-family"]],
      decls: 17,
      vars: 1,
      consts: [
        [1, "container"],
        [1, "display-4"],
        [1, "row"],
        ["class", "col", 4, "ngFor", "ngForOf"],
        [1, "display-5"],
        [1, "col"],
        [1, "lastname"],
        ["src", "./assets/lucien.JPG", "alt", "", 1, "img-family"],
        [1, "img-title-div", "container"],
        [1, "img-forest", "container"],
        [1, "display-5", "container"],
        ["alt", "", 1, "img-family", 3, "src"],
      ],
      template: function (i, o) {
        i & 1 &&
          (M(0, "div", 0)(1, "h1", 1),
          U(2, "Membres de la famille Faure"),
          _(),
          M(3, "div", 2),
          Me(4, Uw, 6, 4, "div", 3),
          _()(),
          M(5, "h2", 4),
          U(6, "Cette famille compte un nouvel arrivant"),
          _(),
          M(7, "div", 5)(8, "p", 6),
          U(9, 'Lucien "Lulu"'),
          _(),
          W(10, "img", 7),
          M(11, "p"),
          U(12, "qui a bien besoin de se balader"),
          _()(),
          M(13, "div", 8),
          W(14, "div", 9),
          M(15, "h3", 10),
          U(16, "R\xE9partition des balades de lulu"),
          _()()),
          i & 2 && (z(4), G("ngForOf", o.familyData));
      },
      dependencies: [ho],
      styles: [
        '.img-family[_ngcontent-%COMP%]{height:15em;width:14em;border-radius:50%;object-fit:cover;transition:all .5s ease-in-out;box-shadow:2px 2px 20px #000}.img-family[_ngcontent-%COMP%]:hover{box-shadow:2px 2px 20px #1aa3c8;transform:scale(1.06)}.lastname[_ngcontent-%COMP%]{margin-bottom:.9rem;margin-top:.6rem;font-size:1.4em;font-weight:500}.col[_ngcontent-%COMP%]{display:flex;justify-content:center;flex-direction:column;align-items:center}p[_ngcontent-%COMP%]{margin-bottom:.5rem;margin-top:.6rem;font-size:1.4em;font-weight:400}h1[_ngcontent-%COMP%]{text-align:center;padding:1.5em}h2[_ngcontent-%COMP%]{text-align:center;padding:1.2em 0 .8em}.img-title-div[_ngcontent-%COMP%]{position:relative;height:9em;margin-top:2em}.img-forest[_ngcontent-%COMP%]{position:absolute;top:0;left:0;background-image:url("./media/forest-OEWAYLDH.webp");background-size:cover;background-position:center;background-repeat:no-repeat;height:12em;background-color:#0ff;opacity:.8}h3[_ngcontent-%COMP%]{position:absolute;top:0;left:0;color:#fff;margin-top:1.1em;text-shadow:2px 2px 5px rgb(0 0 0);text-align:center}',
      ],
    }));
  let t = e;
  return t;
})();
var Yh = [
  {
    id: 1,
    day: "Lundi",
    color: "#006400",
    selectedPersonMatin: "Charlie",
    selectedPersonMidi: "Lili",
    selectedPersonSoir: "",
  },
  {
    id: 2,
    day: "Mardi",
    color: "#008000",
    selectedPersonMatin: "Charlie",
    selectedPersonMidi: "Lili",
    selectedPersonSoir: "G\xE9raldine",
  },
  {
    id: 3,
    day: "Mercredi",
    color: "#8b4513",
    selectedPersonMatin: "Charlie",
    selectedPersonMidi: "Lili",
    selectedPersonSoir: "G\xE9raldine",
  },
  {
    id: 4,
    day: "Jeudi",
    color: "#708090",
    selectedPersonMatin: "Manu",
    selectedPersonMidi: "",
    selectedPersonSoir: "G\xE9raldine",
  },
  {
    id: 5,
    day: "Vendredi",
    color: "#228b22",
    selectedPersonMatin: "Charlie",
    selectedPersonMidi: "Lili",
    selectedPersonSoir: "Manu",
  },
  {
    id: 6,
    day: "Samedi",
    color: "#8fbc8f ",
    selectedPersonMatin: "Manu",
    selectedPersonMidi: "Charlie",
    selectedPersonSoir: "G\xE9raldine",
  },
  {
    id: 7,
    day: "Dimanche",
    color: "#006400",
    selectedPersonMatin: "Lili",
    selectedPersonMidi: "Charlie",
    selectedPersonSoir: "G\xE9raldine",
  },
];
var ip = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(yt), L(nt));
    }),
      (e.ɵdir = se({ type: e }));
    let t = e;
    return t;
  })(),
  rc = (() => {
    let e = class e extends ip {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Bt(e)))(o || e);
      };
    })()),
      (e.ɵdir = se({ type: e, features: [Dt] }));
    let t = e;
    return t;
  })(),
  Lo = new C("NgValueAccessor");
var zw = { provide: Lo, useExisting: jt(() => op), multi: !0 };
function Gw() {
  let t = We() ? We().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var Ww = new C("CompositionEventMode"),
  op = (() => {
    let e = class e extends ip {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !Gw());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(yt), L(nt), L(Ww, 8));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ge("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [ar([zw]), Dt],
      }));
    let t = e;
    return t;
  })();
var qw = new C("NgValidators"),
  Zw = new C("NgAsyncValidators");
function sp(t) {
  return t != null;
}
function ap(t) {
  return Ut(t) ? H(t) : t;
}
function up(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? g(g({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function cp(t, e) {
  return e.map((r) => r(t));
}
function Yw(t) {
  return !t.validate;
}
function lp(t) {
  return t.map((e) => (Yw(e) ? e : (r) => e.validate(r)));
}
function Qw(t) {
  if (!t) return null;
  let e = t.filter(sp);
  return e.length == 0
    ? null
    : function (r) {
        return up(cp(r, e));
      };
}
function dp(t) {
  return t != null ? Qw(lp(t)) : null;
}
function Kw(t) {
  if (!t) return null;
  let e = t.filter(sp);
  return e.length == 0
    ? null
    : function (r) {
        let n = cp(r, e).map(ap);
        return ts(n).pipe(A(up));
      };
}
function fp(t) {
  return t != null ? Kw(lp(t)) : null;
}
function Qh(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Jw(t) {
  return t._rawValidators;
}
function Xw(t) {
  return t._rawAsyncValidators;
}
function Xu(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Po(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function Kh(t, e) {
  let r = Xu(e);
  return (
    Xu(t).forEach((i) => {
      Po(r, i) || r.push(i);
    }),
    r
  );
}
function Jh(t, e) {
  return Xu(e).filter((r) => !Po(t, r));
}
var ko = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = dp(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = fp(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  ec = class extends ko {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Pr = class extends ko {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  tc = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  eE = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  fT = j(g({}, eE), { "[class.ng-submitted]": "isSubmitted" }),
  hp = (() => {
    let e = class e extends tc {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(Pr, 2));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            $a("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Dt],
      }));
    let t = e;
    return t;
  })();
var Rr = "VALID",
  Fo = "INVALID",
  Vn = "PENDING",
  Fr = "DISABLED";
function tE(t) {
  return (Vo(t) ? t.validators : t) || null;
}
function nE(t) {
  return Array.isArray(t) ? dp(t) : t || null;
}
function rE(t, e) {
  return (Vo(e) ? e.asyncValidators : t) || null;
}
function iE(t) {
  return Array.isArray(t) ? fp(t) : t || null;
}
function Vo(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
var nc = class {
  constructor(e, r) {
    (this._pendingDirty = !1),
      (this._hasOwnPendingAsyncValidator = !1),
      (this._pendingTouched = !1),
      (this._onCollectionChange = () => {}),
      (this._parent = null),
      (this.pristine = !0),
      (this.touched = !1),
      (this._onDisabledChange = []),
      this._assignValidators(e),
      this._assignAsyncValidators(r);
  }
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(e) {
    this._rawValidators = this._composedValidatorFn = e;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(e) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
  }
  get parent() {
    return this._parent;
  }
  get valid() {
    return this.status === Rr;
  }
  get invalid() {
    return this.status === Fo;
  }
  get pending() {
    return this.status == Vn;
  }
  get disabled() {
    return this.status === Fr;
  }
  get enabled() {
    return this.status !== Fr;
  }
  get dirty() {
    return !this.pristine;
  }
  get untouched() {
    return !this.touched;
  }
  get updateOn() {
    return this._updateOn
      ? this._updateOn
      : this.parent
      ? this.parent.updateOn
      : "change";
  }
  setValidators(e) {
    this._assignValidators(e);
  }
  setAsyncValidators(e) {
    this._assignAsyncValidators(e);
  }
  addValidators(e) {
    this.setValidators(Kh(e, this._rawValidators));
  }
  addAsyncValidators(e) {
    this.setAsyncValidators(Kh(e, this._rawAsyncValidators));
  }
  removeValidators(e) {
    this.setValidators(Jh(e, this._rawValidators));
  }
  removeAsyncValidators(e) {
    this.setAsyncValidators(Jh(e, this._rawAsyncValidators));
  }
  hasValidator(e) {
    return Po(this._rawValidators, e);
  }
  hasAsyncValidator(e) {
    return Po(this._rawAsyncValidators, e);
  }
  clearValidators() {
    this.validator = null;
  }
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(e = {}) {
    (this.touched = !0),
      this._parent && !e.onlySelf && this._parent.markAsTouched(e);
  }
  markAllAsTouched() {
    this.markAsTouched({ onlySelf: !0 }),
      this._forEachChild((e) => e.markAllAsTouched());
  }
  markAsUntouched(e = {}) {
    (this.touched = !1),
      (this._pendingTouched = !1),
      this._forEachChild((r) => {
        r.markAsUntouched({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  markAsDirty(e = {}) {
    (this.pristine = !1),
      this._parent && !e.onlySelf && this._parent.markAsDirty(e);
  }
  markAsPristine(e = {}) {
    (this.pristine = !0),
      (this._pendingDirty = !1),
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  markAsPending(e = {}) {
    (this.status = Vn),
      e.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !e.onlySelf && this._parent.markAsPending(e);
  }
  disable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = Fr),
      (this.errors = null),
      this._forEachChild((n) => {
        n.disable(j(g({}, e), { onlySelf: !0 }));
      }),
      this._updateValue(),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._updateAncestors(j(g({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!0));
  }
  enable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = Rr),
      this._forEachChild((n) => {
        n.enable(j(g({}, e), { onlySelf: !0 }));
      }),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
      this._updateAncestors(j(g({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!1));
  }
  _updateAncestors(e) {
    this._parent &&
      !e.onlySelf &&
      (this._parent.updateValueAndValidity(e),
      e.skipPristineCheck || this._parent._updatePristine(),
      this._parent._updateTouched());
  }
  setParent(e) {
    this._parent = e;
  }
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(e = {}) {
    this._setInitialStatus(),
      this._updateValue(),
      this.enabled &&
        (this._cancelExistingSubscription(),
        (this.errors = this._runValidator()),
        (this.status = this._calculateStatus()),
        (this.status === Rr || this.status === Vn) &&
          this._runAsyncValidator(e.emitEvent)),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
  }
  _updateTreeValidity(e = { emitEvent: !0 }) {
    this._forEachChild((r) => r._updateTreeValidity(e)),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? Fr : Rr;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(e) {
    if (this.asyncValidator) {
      (this.status = Vn), (this._hasOwnPendingAsyncValidator = !0);
      let r = ap(this.asyncValidator(this));
      this._asyncValidationSubscription = r.subscribe((n) => {
        (this._hasOwnPendingAsyncValidator = !1),
          this.setErrors(n, { emitEvent: e });
      });
    }
  }
  _cancelExistingSubscription() {
    this._asyncValidationSubscription &&
      (this._asyncValidationSubscription.unsubscribe(),
      (this._hasOwnPendingAsyncValidator = !1));
  }
  setErrors(e, r = {}) {
    (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
  }
  get(e) {
    let r = e;
    return r == null || (Array.isArray(r) || (r = r.split(".")), r.length === 0)
      ? null
      : r.reduce((n, i) => n && n._find(i), this);
  }
  getError(e, r) {
    let n = r ? this.get(r) : this;
    return n && n.errors ? n.errors[e] : null;
  }
  hasError(e, r) {
    return !!this.getError(e, r);
  }
  get root() {
    let e = this;
    for (; e._parent; ) e = e._parent;
    return e;
  }
  _updateControlsErrors(e) {
    (this.status = this._calculateStatus()),
      e && this.statusChanges.emit(this.status),
      this._parent && this._parent._updateControlsErrors(e);
  }
  _initObservables() {
    (this.valueChanges = new K()), (this.statusChanges = new K());
  }
  _calculateStatus() {
    return this._allControlsDisabled()
      ? Fr
      : this.errors
      ? Fo
      : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Vn)
      ? Vn
      : this._anyControlsHaveStatus(Fo)
      ? Fo
      : Rr;
  }
  _anyControlsHaveStatus(e) {
    return this._anyControls((r) => r.status === e);
  }
  _anyControlsDirty() {
    return this._anyControls((e) => e.dirty);
  }
  _anyControlsTouched() {
    return this._anyControls((e) => e.touched);
  }
  _updatePristine(e = {}) {
    (this.pristine = !this._anyControlsDirty()),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  _updateTouched(e = {}) {
    (this.touched = this._anyControlsTouched()),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  _registerOnCollectionChange(e) {
    this._onCollectionChange = e;
  }
  _setUpdateStrategy(e) {
    Vo(e) && e.updateOn != null && (this._updateOn = e.updateOn);
  }
  _parentMarkedDirty(e) {
    let r = this._parent && this._parent.dirty;
    return !e && !!r && !this._parent._anyControlsDirty();
  }
  _find(e) {
    return null;
  }
  _assignValidators(e) {
    (this._rawValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedValidatorFn = nE(this._rawValidators));
  }
  _assignAsyncValidators(e) {
    (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedAsyncValidatorFn = iE(this._rawAsyncValidators));
  }
};
var pp = new C("CallSetDisabledState", {
    providedIn: "root",
    factory: () => ic,
  }),
  ic = "always";
function oE(t, e) {
  return [...e.path, t];
}
function sE(t, e, r = ic) {
  uE(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    cE(t, e),
    dE(t, e),
    lE(t, e),
    aE(t, e);
}
function Xh(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function aE(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function uE(t, e) {
  let r = Jw(t);
  e.validator !== null
    ? t.setValidators(Qh(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = Xw(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(Qh(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Xh(e._rawValidators, i), Xh(e._rawAsyncValidators, i);
}
function cE(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && gp(t, e);
  });
}
function lE(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && gp(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function gp(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function dE(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function fE(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function hE(t) {
  return Object.getPrototypeOf(t.constructor) === rc;
}
function pE(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === op ? (r = o) : hE(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function ep(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function tp(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var gE = class extends nc {
  constructor(e = null, r, n) {
    super(tE(r), rE(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Vo(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (tp(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    ep(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    ep(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    tp(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var mE = { provide: Pr, useExisting: jt(() => oc) },
  np = (() => Promise.resolve())(),
  oc = (() => {
    let e = class e extends Pr {
      constructor(n, i, o, s, a, u) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = u),
          (this.control = new gE()),
          (this._registered = !1),
          (this.name = ""),
          (this.update = new K()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = pE(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          fE(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        sE(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        np.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && co(i);
        np.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? oE(n, this._parent) : [n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        L(ec, 9),
        L(qw, 10),
        L(Zw, 10),
        L(Lo, 10),
        L(In, 8),
        L(pp, 8)
      );
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: ["disabled", "isDisabled"],
          model: ["ngModel", "model"],
          options: ["ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        features: [ar([mE]), Dt, wn],
      }));
    let t = e;
    return t;
  })();
var vE = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = oe({ type: e })),
    (e.ɵinj = ie({}));
  let t = e;
  return t;
})();
var yE = { provide: Lo, useExisting: jt(() => jo), multi: !0 };
function mp(t, e) {
  return t == null
    ? `${e}`
    : (e && typeof e == "object" && (e = "Object"), `${t}: ${e}`.slice(0, 50));
}
function DE(t) {
  return t.split(":")[0];
}
var jo = (() => {
    let e = class e extends rc {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i = this._getOptionId(n),
          o = mp(i, n);
        this.setProperty("value", o);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          (this.value = this._getOptionValue(i)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i), n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = DE(n);
        return this._optionMap.has(i) ? this._optionMap.get(i) : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Bt(e)))(o || e);
      };
    })()),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["select", "formControlName", "", 3, "multiple", ""],
          ["select", "formControl", "", 3, "multiple", ""],
          ["select", "ngModel", "", 3, "multiple", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ge("change", function (a) {
              return o.onChange(a.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [ar([yE]), Dt],
      }));
    let t = e;
    return t;
  })(),
  vp = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(mp(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select.writeValue(this._select.value);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(nt), L(yt), L(jo, 9));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })(),
  CE = { provide: Lo, useExisting: jt(() => yp), multi: !0 };
function rp(t, e) {
  return t == null
    ? `${e}`
    : (typeof e == "string" && (e = `'${e}'`),
      e && typeof e == "object" && (e = "Object"),
      `${t}: ${e}`.slice(0, 50));
}
function wE(t) {
  return t.split(":")[0];
}
var yp = (() => {
    let e = class e extends rc {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i;
        if (Array.isArray(n)) {
          let o = n.map((s) => this._getOptionId(s));
          i = (s, a) => {
            s._setSelected(o.indexOf(a.toString()) > -1);
          };
        } else
          i = (o, s) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          let o = [],
            s = i.selectedOptions;
          if (s !== void 0) {
            let a = s;
            for (let u = 0; u < a.length; u++) {
              let c = a[u],
                l = this._getOptionValue(c.value);
              o.push(l);
            }
          } else {
            let a = i.options;
            for (let u = 0; u < a.length; u++) {
              let c = a[u];
              if (c.selected) {
                let l = this._getOptionValue(c.value);
                o.push(l);
              }
            }
          }
          (this.value = o), n(o);
        };
      }
      _registerOption(n) {
        let i = (this._idCounter++).toString();
        return this._optionMap.set(i, n), i;
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i)._value, n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = wE(n);
        return this._optionMap.has(i) ? this._optionMap.get(i)._value : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Bt(e)))(o || e);
      };
    })()),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["select", "multiple", "", "formControlName", ""],
          ["select", "multiple", "", "formControl", ""],
          ["select", "multiple", "", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Ge("change", function (a) {
              return o.onChange(a.target);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [ar([CE]), Dt],
      }));
    let t = e;
    return t;
  })(),
  Dp = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(rp(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(rp(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, "selected", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(L(nt), L(yt), L(yp, 9));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })();
var EE = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = oe({ type: e })),
    (e.ɵinj = ie({ imports: [vE] }));
  let t = e;
  return t;
})();
var Cp = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [{ provide: pp, useValue: n.callSetDisabledState ?? ic }],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = oe({ type: e })),
    (e.ɵinj = ie({ imports: [EE] }));
  let t = e;
  return t;
})();
function bE(t, e) {
  if ((t & 1 && (M(0, "option", 10), U(1), _()), t & 2)) {
    let r = e.$implicit;
    G("value", r.firstname), z(), wt(" ", r.firstname, " ");
  }
}
function ME(t, e) {
  if ((t & 1 && (M(0, "option", 10), U(1), _()), t & 2)) {
    let r = e.$implicit;
    G("value", r.firstname), z(), wt(" ", r.firstname, " ");
  }
}
function _E(t, e) {
  if ((t & 1 && (M(0, "option", 10), U(1), _()), t & 2)) {
    let r = e.$implicit;
    G("value", r.firstname), z(), wt(" ", r.firstname, " ");
  }
}
function SE(t, e) {
  if (t & 1) {
    let r = If();
    M(0, "div", 3)(1, "p", 4),
      U(2),
      _(),
      M(3, "select", 5),
      Ge("ngModelChange", function (i) {
        let s = Hi(r).$implicit;
        return zi((s.selectedPersonMatin = i));
      }),
      M(4, "option", 6),
      U(5, "Matin"),
      _(),
      Me(6, bE, 2, 2, "option", 7),
      _(),
      M(7, "select", 8),
      Ge("ngModelChange", function (i) {
        let s = Hi(r).$implicit;
        return zi((s.selectedPersonMidi = i));
      }),
      M(8, "option", 6),
      U(9, "Midi"),
      _(),
      Me(10, ME, 2, 2, "option", 7),
      _(),
      M(11, "select", 9),
      Ge("ngModelChange", function (i) {
        let s = Hi(r).$implicit;
        return zi((s.selectedPersonSoir = i));
      }),
      M(12, "option", 6),
      U(13, "Soir"),
      _(),
      Me(14, _E, 2, 2, "option", 7),
      _()();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = Ct();
    z(2),
      wt(" ", r.day, " "),
      z(),
      G("ngModel", r.selectedPersonMatin),
      z(3),
      G("ngForOf", n.familyData),
      z(),
      G("ngModel", r.selectedPersonMidi),
      z(3),
      G("ngForOf", n.familyData),
      z(),
      G("ngModel", r.selectedPersonSoir),
      z(3),
      G("ngForOf", n.familyData);
  }
}
function xE(t, e) {
  if ((t & 1 && W(0, "img", 19), t & 2)) {
    let r = Ct().$implicit,
      n = Ct();
    Ht("alt", r.selectedPersonMatin),
      G("src", n.getPersonPicture(r.selectedPersonMatin), En);
  }
}
function TE(t, e) {
  if ((t & 1 && W(0, "img", 19), t & 2)) {
    let r = Ct().$implicit,
      n = Ct();
    Ht("alt", r.selectedPersonMidi),
      G("src", n.getPersonPicture(r.selectedPersonMidi), En);
  }
}
function AE(t, e) {
  if ((t & 1 && W(0, "img", 19), t & 2)) {
    let r = Ct().$implicit,
      n = Ct();
    Ht("alt", r.selectedPersonSoir),
      G("src", n.getPersonPicture(r.selectedPersonSoir), En);
  }
}
function NE(t, e) {
  if (
    (t & 1 &&
      (M(0, "div", 3)(1, "p", 11),
      U(2),
      _(),
      M(3, "div", 12)(4, "p", 13),
      U(5, "Matin"),
      _(),
      Me(6, xE, 1, 2, "img", 14),
      _(),
      M(7, "div", 15)(8, "p", 16),
      U(9, "Midi"),
      _(),
      Me(10, TE, 1, 2, "img", 14),
      _(),
      M(11, "div", 17)(12, "p", 18),
      U(13, "Soir"),
      _(),
      Me(14, AE, 1, 2, "img", 14),
      _()()),
    t & 2)
  ) {
    let r = e.$implicit;
    z(2),
      wt(" ", r.day, " "),
      z(4),
      G("ngIf", r.selectedPersonMatin),
      z(4),
      G("ngIf", r.selectedPersonMidi),
      z(4),
      G("ngIf", r.selectedPersonSoir);
  }
}
var wp = (() => {
  let e = class e {
    constructor() {
      (this.weekDayData = Yh), (this.familyData = Ln);
    }
    getPersonPicture(n) {
      let i = this.familyData.find((o) => o.firstname === n);
      return i ? i.picture : "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-week-card"]],
      decls: 4,
      vars: 2,
      consts: [
        [1, "section-card"],
        ["class", "day-div", 4, "ngFor", "ngForOf"],
        [1, "section-calendar"],
        [1, "day-div"],
        [1, "display-6", "day-text", 2, "color", "#8b4513"],
        ["name", "", "id", "morning-select", 3, "ngModel", "ngModelChange"],
        ["value", ""],
        [3, "value", 4, "ngFor", "ngForOf"],
        ["name", "", "id", "half-select", 3, "ngModel", "ngModelChange"],
        ["name", "", "id", "evening-select", 3, "ngModel", "ngModelChange"],
        [3, "value"],
        [1, "display-6", "day-text", 2, "color", "green"],
        [1, "moment-div", "morning"],
        [1, "morning-text"],
        ["class", "person-img", 3, "src", "alt", 4, "ngIf"],
        [1, "moment-div", "half"],
        [1, "half-text"],
        [1, "moment-div", "evening"],
        [1, "evening-text"],
        [1, "person-img", 3, "src", "alt"],
      ],
      template: function (i, o) {
        i & 1 &&
          (M(0, "section", 0),
          Me(1, SE, 15, 7, "div", 1),
          _(),
          M(2, "section", 2),
          Me(3, NE, 15, 4, "div", 1),
          _()),
          i & 2 &&
            (z(),
            G("ngForOf", o.weekDayData),
            z(2),
            G("ngForOf", o.weekDayData));
      },
      dependencies: [ho, Wf, vp, Dp, jo, hp, oc],
      styles: [
        ".section-card[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;gap:1em}.section-calendar[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;gap:1em;margin-top:4em}.day-div[_ngcontent-%COMP%]{border-radius:2em;border:1px solid black;padding:1em;gap:1em;display:flex;flex-direction:column;justify-content:center;align-items:center;width:20em;box-shadow:2px 2px 10px #000}.day-div[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-bottom:0}.day-div[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{border-radius:.5em;text-align:center;padding:.2em;border:none;box-shadow:1px 1px 3px #000;width:112px;height:36px;cursor:pointer}.day-div[_ngcontent-%COMP%]   option[_ngcontent-%COMP%]{background-color:#fff;color:#000}.moment-div[_ngcontent-%COMP%]{display:flex;align-items:center;flex-direction:column;padding:.4em;border-radius:.5em;width:90%;color:#000;box-shadow:1px 1px 10px #000}#morning-select[_ngcontent-%COMP%]{background:#576c37;color:#fff;text-shadow:1px 1px 2px black}#half-select[_ngcontent-%COMP%]{background:#6d5549;color:#fff;text-shadow:1px 1px 2px black}#evening-select[_ngcontent-%COMP%]{background:#a0b942;color:#fff;text-shadow:1px 1px 2px black}.morning[_ngcontent-%COMP%]{background:#ffdab9}.half[_ngcontent-%COMP%]{background:#fffacd}.evening[_ngcontent-%COMP%]{background:#ffb192d1}.person-img[_ngcontent-%COMP%]{max-width:4em;height:4em;border-radius:50%;object-fit:cover}@media (max-width: 1300px){.section-card[_ngcontent-%COMP%]{flex-wrap:wrap;margin-top:6rem}.section-calendar[_ngcontent-%COMP%]{flex-wrap:wrap}}@media (max-width: 468px){.section-card[_ngcontent-%COMP%]{flex-direction:column}}",
      ],
    }));
  let t = e;
  return t;
})();
var Ep = (() => {
  let e = class e {
    constructor() {
      this.familyData = Ln;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-lulu-array"]],
      decls: 4,
      vars: 0,
      consts: [
        [1, "container"],
        [1, "display-5", "container", "text-center"],
      ],
      template: function (i, o) {
        i & 1 &&
          (M(0, "section", 0),
          W(1, "app-week-card"),
          M(2, "h4", 1),
          U(
            3,
            " Voila une organisation bien g\xE9r\xE9e !!! Lulu va \xEAtre heureux de parcourir les sentiers de la for\xEAt "
          ),
          _()());
      },
      dependencies: [wp],
      styles: [
        "section[_ngcontent-%COMP%]{margin-top:8em}section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin-top:2em}@media (max-width: 768px){section[_ngcontent-%COMP%]{margin-top:2em}}",
      ],
    }));
  let t = e;
  return t;
})();
var Ip = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-angular-header"]],
      decls: 21,
      vars: 0,
      consts: [
        [1, "nav-div-one"],
        [1, "nav-div-two"],
        [
          "xmlns",
          "http://www.w3.org/2000/svg",
          "viewBox",
          "0 0 982 239",
          "fill",
          "none",
          1,
          "angular-logo",
        ],
        ["clip-path", "url(#a)"],
        [
          "fill",
          "url(#b)",
          "d",
          "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
        ],
        [
          "fill",
          "url(#c)",
          "d",
          "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
        ],
        [
          "id",
          "c",
          "cx",
          "0",
          "cy",
          "0",
          "r",
          "1",
          "gradientTransform",
          "rotate(118.122 171.182 60.81) scale(205.794)",
          "gradientUnits",
          "userSpaceOnUse",
        ],
        ["stop-color", "#FF41F8"],
        ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
        ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
        [
          "id",
          "b",
          "x1",
          "0",
          "x2",
          "982",
          "y1",
          "192",
          "y2",
          "192",
          "gradientUnits",
          "userSpaceOnUse",
        ],
        ["stop-color", "#F0060B"],
        ["offset", "0", "stop-color", "#F0070C"],
        ["offset", ".526", "stop-color", "#CC26D5"],
        ["offset", "1", "stop-color", "#7702FF"],
        ["id", "a"],
        ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ],
      template: function (i, o) {
        i & 1 &&
          (M(0, "header")(1, "nav")(2, "div", 0)(3, "div", 1),
          W(4, "h1"),
          dd(),
          M(5, "svg", 2)(6, "g", 3),
          W(7, "path", 4)(8, "path", 5),
          _(),
          M(9, "defs")(10, "radialGradient", 6),
          W(11, "stop", 7)(12, "stop", 8)(13, "stop", 9),
          _(),
          M(14, "linearGradient", 10),
          W(15, "stop", 11)(16, "stop", 12)(17, "stop", 13)(18, "stop", 14),
          _(),
          M(19, "clipPath", 15),
          W(20, "path", 16),
          _()()()()()()());
      },
      styles: [
        "header[_ngcontent-%COMP%]{display:flex;justify-content:space-around;align-items:center;background-color:#b19fc4;background:linear-gradient(to right,#ea2087,#8207fa,#ea2087,#8207fa)}nav[_ngcontent-%COMP%]{width:70%;border:3px double #ea2087;display:flex;justify-content:space-around;align-items:center;padding:.5em;border-radius:50%;background:#ea2087}.nav-div-one[_ngcontent-%COMP%]{width:50%;min-height:100%;display:flex;justify-content:center;align-items:center;padding:1rem;box-sizing:inherit;position:relative;border:3px double #8207fa;border-radius:50%;background:#8207fa}.nav-div-two[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;background:white;border-radius:50%;width:83%;gap:.5em;padding:1.1em}h1[_ngcontent-%COMP%]{color:#fff;font-size:2em;letter-spacing:-1.8px;font-weight:600;background:linear-gradient(to right,#8207fa,#ea2087);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.angular-logo[_ngcontent-%COMP%]{max-width:9.2rem}@media (max-width: 1024px){h1[_ngcontent-%COMP%]{display:none}}",
      ],
    }));
  let t = e;
  return t;
})();
var bp = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-footer"]],
      decls: 3,
      vars: 0,
      consts: [
        [1, "container"],
        [1, "fs-5"],
      ],
      template: function (i, o) {
        i & 1 &&
          (M(0, "footer", 0)(1, "p", 1), U(2, "\xA9 Manu-dev-2024"), _()());
      },
      styles: [
        "footer[_ngcontent-%COMP%]{height:12em;display:flex;justify-content:center;align-items:flex-end}h3[_ngcontent-%COMP%]{text-align:center}",
      ],
    }));
  let t = e;
  return t;
})();
var Mp = (() => {
  let e = class e {
    constructor() {
      this.title = "familyApp";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = ce({
      type: e,
      selectors: [["app-root"]],
      decls: 4,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
          W(0, "app-angular-header")(1, "app-family")(2, "app-lulu-array")(
            3,
            "app-footer"
          );
      },
      dependencies: [Zh, Ep, Ip, bp],
    }));
  let t = e;
  return t;
})();
var _p = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = oe({ type: e, bootstrap: [Mp] })),
    (e.ɵinj = ie({ imports: [ih, qh, Cp] }));
  let t = e;
  return t;
})();
rh()
  .bootstrapModule(_p)
  .catch((t) => console.error(t));
