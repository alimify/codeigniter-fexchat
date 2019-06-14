"use strict";
(function() {
  function c(z) {
    return (z.style.display = z.style.display === "block" ? "none" : "block");
  }
  function d(z) {
    return z === void 0 ? "" : (z.style.display = "none");
  }
  function f(z) {
    return z === void 0 ? "" : (z.style.display = "block");
  }
  function g(z) {
    z.target == (1 >= arguments.length ? void 0 : arguments[1])
      ? c(2 >= arguments.length ? void 0 : arguments[2])
      : z.target != (2 >= arguments.length ? void 0 : arguments[2]) &&
        d(2 >= arguments.length ? void 0 : arguments[2]);
  }
  function i(z, A, B) {
    return void 0 !== B && 1
      ? void $(z).on("click", function() {
          return c(l(A));
        })
      : void $(z).on("click", function() {
          return $(A).show();
        });
  }
  function j(z, A) {
    $(z).on("click", function() {
      return $(A).hide();
    });
  }
  function k(z, A, B) {
    $(A).each(function(C, D) {
      z.target !== D && D.classList.contains("active")
        ? D.classList.remove(B)
        : z.target === D ? D.classList.add(B) : "";
    });
  }
  function l(z) {
    return document.querySelector(z);
  }
  function n(z, A, B) {
    return z.addEventListener(A, B);
  }
  var q = document.querySelector("main#mRoot");
  q.scrollTo(0, q.scrollHeight);
  $("#summernote").summernote({
    toolbar: !1,
    height: 40,
    disableResizeEditor: !0,
    tooltip: null,
    popover: !1,
    callbacks: {
      onFocus: function onFocus() {
        $("#mSendBtn").addClass("active");
      }
    }
  }),
    $(".note-editable").focusout(function() {
      $("#mSendBtn").removeClass("active");
    });
  var p = !1;
  $("#parent").on("click", ".jobListPopUp", function(z) {
    var A = z.delegateTarget.clientHeight,
      B = z.originalEvent.screenX,
      C = z.originalEvent.screenY - 109;
    if (C > A - 148) {
      $(".f-popup.pop-dialog")
        .css({ top: C - 144 + "px", left: B + "px" })
        .addClass("is-opendown")
        .removeClass("is-opentop"),
        (p = !0);
    } else
      $(".f-popup.pop-dialog")
        .css({ top: C + "px", left: B + "px" })
        .addClass("is-opentop")
        .removeClass("is-opendown"),
        (p = !0);
    $(".f-popup.pop-dialog>span").click(function() {
      var E = $(".f-popup.pop-dialog");
      E.hasClass("is-opendown")
        ? E.removeClass("is-opendown")
        : E.removeClass("is-opentop");
    });
  }),
    $(".f-popup.pop-dialog li").click(function() {
      $(".f-menu-siderbar").toggleClass("f-is-open");
    }),
    $("#f-menu-siderbar-close").click(function() {
      return $(".f-menu-siderbar").toggleClass("f-is-open");
    }),
    $(".button.a").click(function(z) {
      k(z, ".button.a", "active");
      var A = l("#chatList"),
        B = l("#contactList");
      l("#contactListToggle").classList.contains("active") ? f(B) : d(B),
        l("#chatListToggle").classList.contains("active") ? f(A) : d(A);
    }),
    $(".content .dropdown-item").click(function() {
      var A = this;
      $(this)
        .parent()
        .prev(".f-dropdownTrigger")
        .text(this.innerText),
        $(".content .dropdown-item").each(function(B, C) {
          C.classList.contains("active")
            ? C.classList.remove("active")
            : A === C ? C.classList.add("active") : "";
        });
    }),
    i("#add-to-group-display", ".add-to-group", !0),
    j(".add-to-group-dismiss", ".add-to-group"),
    j(".f-modal-dismiss", ".f-modal"),
    i("#mainSettingModal", "#settingModal"),
    i("#newGroup", "#newGroupModal"),
    $("body").click(function(z) {
      return (
        g(z, $("#mainSetting")[0], $(".mainSetting-dropdown")[0]),
        z.target.classList.contains("f-dropdownTrigger")
          ? void g(z, z.target, z.target.nextElementSibling)
          : void $(".f-dropdown .content").each(function(A, B) {
              B.style.display = "none";
            })
      );
    }),
    n(l("#imageUpload"), "click", function() {
      l("div input[name=uploadImage]").click();
    }),
    n(l("#allFileUpload"), "click", function() {
      l("div input[name=uploadAll]").click();
    }),
    n(l("#upload"), "click", function() {
      c(l("#uploadPopUp"));
    });
  var u = l(".note-editable.panel-body"),
    v = l("footer#eRoot"),
    w = l("main#mRoot"),
    x = l("#mSendBtn");
  n(u, "paste", function() {
    var A = u.clientHeight;
    92 <= A ||
      ((w.style.height = w.clientHeight - 90 + "px"),
      (v.style.height = v.clientHeight + 91 + "px"),
      (u.style.height = "132px"));
  }),
    n(u, "keyup", function(z) {
      var A = parseInt(z.target.style.height);
      102 <= A ||
        ((w.style.height = w.clientHeight - z.target.scrollTop + "px"),
        (v.style.height = 1 + v.clientHeight + z.target.scrollTop + "px"),
        (u.style.height = A + z.target.scrollTop + "px"));
    });
})();
