/*
 * Created with Sublime Text 3.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * github: https://github.com/tianxiangbing/format-number
 * User: 田想兵
 * Date: 2015-08-01
 * Time: 11:27:55
 * Contact: 55342775@qq.com
 */
;
(function (root, factory) {
    //amd
    if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        root.InputNumber = factory(window.Zepto || window.jQuery || $);
    }
})(this, function () {
    //添加xtype为InputNumber
    if (window.Eui) {
        Eui.Extra.registerUiExtType('InputNumber', {
            options: {
                decimal: 2
            },
            handler(target, options) {
                var $target = $(target);
                $target.InputNumber(options);
            }
        });
    }
    $.fn.InputNumber = function (settings) {
        var arr = [];
        $(this).each(function () {
            if ($(this).data('component')) {
                $(this).data('component').update(settings);
            } else {
                var options = $.extend({
                    trigger: $(this)
                }, settings);
                var number = new InputNumber();
                number.init(options);
                $(this).data('component', number);
                arr.push(number);
            }
        });
        return arr;
    };

    /**
     *   说明: 设置文本框的光标位置
     *   参数: 文本框对象 {dom object}, 光标的位置 {int}
     * 返回值: {void}
     */
    function setTxtCursorPosition(txtObj, pos) {
        var tempObj = txtObj;
        var cursurPosition = -1;
        if (tempObj.selectionStart != undefined) { //非IE浏览器
            tempObj.setSelectionRange(pos, pos);
        } else { //IE
            var range = tempObj.createTextRange();
            range.move("character", pos);
            range.select();
        }
    }
    //获取当前光标位置
    const getPosition = function (element) {
        var cursorPos = 0;
        if (document.selection) {//IE
            var selectRange = document.selection.createRange();
            selectRange.moveStart('character', -element.value.length);
            cursorPos = selectRange.text.length;
        } else if (element && (element.selectionStart || element.selectionStart == '0')) {
            cursorPos = element.selectionStart;
        }
        return cursorPos;
    }
    function getInputSelection(element) {
        var myArea = element;
        var selection;
        if (myArea.selectionStart) {
            if (myArea.selectionStart != undefined) {
                selection = myArea.value.substr(myArea.selectionStart, myArea.selectionEnd - myArea.selectionStart);
            }
        } else {
            if (window.getSelection) {  //非ie浏览器,firefox,safari,opera
                selection = window.getSelection();
            } else if (document.getSelection) {
                selection = document.getSelection();
            } else if (document.selection) {
                selection = document.selection.createRange().text;
            }
        }
        return selection;
    }
    var InputNumber = function () { };
    InputNumber.prototype = {
        init: function (settings) {
            var _this = this,
                minus = ''
            settings = $.extend({
                trigger: '[data-type="money"]',
                decimal: 2,
                minus: false, //是否支持负数,默认不支持
                parent: 'body',
                maxLength: 30
            }, settings);
            this.settings = settings;
            var excludeKey = {
                "left": 37,
                "right": 39,
                "top": 38,
                "down": 40,
                "home": 36,
                "end": 35,
                "shift": 16
            };
            var regex = '([1-9]\\d*(\\.\\d{1,2})?|0(\\.\\d{1,2})?)';
            if (settings.decimal <= 0 && settings.minus == true) {
                regex = '(^-?[1-9]\\d*$)|(^[0]$)'; //正负整数
            } else if (settings.decimal == 0) {
                regex = '(^[1-9]\\d*$)|(^[0]$)'; //正整数
            } else if (settings.minus == true) {
                //regex = '^-?([1-9]\\d*(\\.\\d{1,' + settings.decimal + '})?|([^0]{1}(\\.\\d{1,' + settings.decimal + '}))?)';
                regex = '(^-)?((([1-9]d*(\\.\\d{1,' + settings.decimal + '})?)|((^[0]{1}\\.(\\d{1,' + settings.decimal + '})?$))|^[0]$))'
            } else {
                regex = '([1-9]\\d*(\\.\\d{1,' + settings.decimal + '})?|([^0]{1}(\\.\\d{1,' + settings.decimal + '}))?)';
            }
            parent = parent || 'body';
            $(settings.trigger, parent).each(function (i, v) {
                var txt, formatTxt;
                if ($(v)[0].tagName == 'INPUT') {
                    txt = $(v).val();
                    if ($(v).attr('data-name')) {
                        var name = $(v).attr('data-name'),
                            id = name.split('.')[1] || name.split('.')[0];
                        $(v).parent().append('<input data-rule="number" id="' + id + '" type="hidden" name="' + name + '" />');
                        $('#' + id).val(_this.getMoneyfloat($(v).val()));
                    }
                    formatTxt = _this.doFormat(txt);
                    $(v).val(formatTxt);
                    $(this).attr('data-value', _this.getMoneyfloat($(v).val()));
                } else {
                    txt = $(v).text();
                    formatTxt = _this.doFormat(txt);
                    $(v).attr('data-value', txt).text(formatTxt);
                }
            });

            $(settings.trigger, parent).on('keyup', function (e) {
                var exe = /^(\-\-)+/g;
                var value = e.target.value;
                if(exe.test(value)){
                    value=$(this).val().replace(exe,'-')
                    $(this).val(value);
                    setTxtCursorPosition(e.target,1);
                }
                // console.log('up:::', value)
                var intN = value.replace(/\-/g,'').split('.')[0];
                if (intN.length > settings.maxLength) {
                    value = $(this).data('prev');
                    $(this).val(value);
                    setTxtCursorPosition(e.target, $(this).data('prevPos'));
                }
                e.target.value = value.replace(/[^\d,,\.\-]]*/g, '');
                checkNumber.call(this, e)
            });
            $(settings.trigger, parent).on('keydown', function (e) {
                var pos = getPosition(e.target);
                var txt = getInputSelection(e.target);
                var v = String($(this).val());
                // console.log('down:::', v)
                $(this).data('prev', v);
                $(this).data('prevPos', pos);
                // console.log(pos, txt, v)
                var left = v.substring(0, pos);
                var right = v.substring(txt.length + pos);
                var valueArray = $(this).val().replace(/\,/gi, '').split('.');
                //实现K\M
                if (e.keyCode === 75 && valueArray != '0' && $(this).val() != '') {
                    //K
                    // valueArray[0] += '000';
                    // var value = valueArray.length == 2 ? valueArray[0] + '.' + valueArray[1] : valueArray[0];
                    var value = left + '000' + right;
                    $(this).val(value);
                    setTxtCursorPosition(e.target, pos+3);
                    checkNumber.call(this, e)
                    return false;
                }
                if (e.keyCode === 77 && valueArray != '0' && $(this).val() != '') {
                    //M
                    // valueArray[0] += '000000';
                    // var value = valueArray.length == 2 ? valueArray[0] + '.' + valueArray[1] : valueArray[0];
                    var value = left + '000000' + right;
                    $(this).val(value);
                    setTxtCursorPosition(e.target, pos+6);
                    checkNumber.call(this, e)
                    return false;
                }
                checkNumber.call(this, e)
            });
            $(settings.trigger, parent).on('keydown', function (e) {
                // console.log(e.keyCode)
                // console.log(e)
                if (e.keyCode == 8) {
                    return;
                }
                var pos = getPosition(e.target);
                // console.log(pos)
                if (e.key == '-' && pos == 0 && settings.minus) {
                    return;
                }
                if (e.key == '.' && pos == $(this).val().length && !isNaN($(this).val()) && $(this).val().indexOf('.') == -1) {
                    return;
                }
                if (isNaN(e.key) && ["ArrowLeft","ArrowRight","Delete"].indexOf(e.key)==-1) {
                    return false;
                }
                checkNumber.call(this, e)
            });
            $(settings.trigger, parent).on('focus', function (e) {
                var formatTxt = e.target.value.replace(/\,/g, '');
                $(this).val(formatTxt);
            })
            $(settings.trigger, parent).on('blur', function (e) {
                var value = e.target.value;
                e.target.value = value.replace(/[^\d,,\.\-]]*/g, '');
                checkNumber.call(this, e)
                var formatTxt = _this.doFormat(e.target.value);
                $(this).val(formatTxt);
                var v = $(this).val()
                var exe = /(^[0\,\.\-]+$)/
                if ($(this).val() == '-') {
                    $(this).val('');
                    $(this).attr('data-value', '');
                } else if (exe.test(v)) {
                    $(this).val('0');
                    $(this).attr('data-value', '0');
                }
                var tempValue = $(this).val();
                if (tempValue.lastIndexOf(".") >= 0) {
                    if (tempValue.lastIndexOf(".") == tempValue.length - 1) {
                        $(this).val(tempValue.substr(0, tempValue.length - 1));
                    }
                }
            });

            function checkNumber(e) {
                var name = $(this).attr('data-name'),
                    id = name.split('.')[1] || name.split('.')[0];
                // GetNumberResult(e, $(this)[0], regex);
                var v = _this.getMoneyfloat($(this).val());
                $('#' + id).val(v);
                $(this).val(v);
                $(this).attr('data-value', v);
            }

            function GetNumberResult(e, obj, reg) {
                var valueLength = obj.value.length;
                var position = getTxtCursorPosition(obj);
                var key = window.event ? e.keyCode : e.which;
                var result = convertNumberN(key, obj.value, reg);
                obj.value = result
                position += (result.length - valueLength);
                setTxtCursorPosition(obj, position);
            }

            /**
             *   说明: 检查不做处理的键盘Key
             *   参数: 键盘KeyCode {string}
             * 返回值: 如果是不做处理的key返回true，反之false {bool}
             */
            function checkInactionKey(keyCode) {

                for (var key in excludeKey) {
                    if (keyCode == excludeKey[key]) {
                        return true;
                    }
                }
                return false;
            }

            /**
             *   说明: 获取文本框的光标位置
             *   参数: 文本框对象 {dom object}
             * 返回值: {int}
             */
            function getTxtCursorPosition(txtObj) {

                var tempObj = txtObj;
                var cursurPosition = -1;

                if (tempObj.selectionStart != undefined) { //非IE浏览器
                    cursurPosition = tempObj.selectionStart;
                } else { //IE
                    var range = document.selection.createRange();
                    range.moveStart("character", -tempObj.value.length);
                    cursurPosition = range.text.length;
                }

                return cursurPosition;
            }

            /**
             *   说明: 转换数字为千分位，常用于财务系统
             *   参数: 键盘key {string}，被处理的字符串 {string}
             * 返回值: 返回转换的结果 {string}
             */
            function convertNumberN(key, value, reg) {

                if (checkInactionKey(key)) {
                    return value;
                }

                var tempValue = value;
                var isminus = false;
                var replaceReg = /[^\d\.]/g;
                if (settings.minus && /^\-/.test(tempValue)) {
                    tempValue = tempValue.slice(1);
                    isminus = true;
                }
                if (tempValue.indexOf(".") <= 0) {
                    //replaceReg = /[^\d]/g;
                    tempValue = tempValue.replace(replaceReg, "");
                } else {
                    tempValue = tempValue.replace(replaceReg, "");
                    var isNaNNum = parseFloat(tempValue + "00");
                    if (isNaN(isNaNNum)) {
                        tempValue = isNaNNum;
                    }
                    if (/\./.test(tempValue) && settings.decimal == 0) {
                        tempValue = tempValue.toString().replace(/\./g, '');
                    }
                }
                var re = new RegExp(reg);
                if (!re.exec(tempValue) && tempValue != "") {
                    tempValue = "0";
                }

                var tempValueArray = tempValue.split(".");
                var maxLength = settings.maxLength;
                tempValue = tempValueArray.length > 1 ?
                    (tempValueArray[0].length > maxLength ? tempValueArray[0].substr(0, maxLength) : tempValueArray[0]) + "." + tempValueArray[1] :
                    (tempValue.length > maxLength ? tempValue.substr(0, maxLength) : tempValue);

                // var result = _this.doFormat(tempValue);
                var result = tempValue;
                if (isminus) result = '-' + result;
                if (result == null) {
                    return;
                }

                var resultArray = result.split(".");

                if (tempValue.lastIndexOf(".") >= 0) {
                    if (tempValue.lastIndexOf(".") == tempValue.length - 1) {
                        tempValue = resultArray[0] + '.';
                    } else {
                        var subLength = tempValue.length - (tempValue.lastIndexOf(".") + 1);
                        tempValue = resultArray[0] + "." + (resultArray[1] ? resultArray[1].substring(0, subLength) : '0');
                    }
                } else {
                    tempValue = resultArray[0];
                }


                return tempValue;
            }

        },
        update(settings) {
            $.extend(this.settings, settings);
        },
        getMoneyfloat: function (s) {
            if (s == '') {
                return null;
            }
            return (s + "").replace(/[^\d\.-]/g, "").replace(/^[0]+/, '0').replace(/^\-[0]+/, '-0');
        },
        doFormat: function (s) {
            var _this = this;
            if (!s) return "";

            if ($.isNumeric(s)) {
                s = s.toString();
            }
            if (_this.settings.decimal > 0 && _this.settings.isAutoZero && !isNaN(s)) {
                var arr = s.split('.');
                var decimals = _this.settings.decimal;
                if (arr.length > 1) {
                    var d = arr.length == 1 ? 0 : arr[1].length;
                    s += Array(decimals + 1).join(0).slice(0, Math.max(0, decimals - d));
                } else {
                    s += '.' + Array(decimals + 1).join(0).slice(0, Math.max(0, decimals));
                }
            }
            if (typeof s === 'string' ) {
                s = s.replace(/^(-?\d+)((\.\d*)?)$/, function (v1, v2, v3) {
                    if(_this.settings.formatThousand){
                        return v2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + (v3.slice(0, _this.settings.decimal + 1));
                    }else{
                        return v2 + (v3.slice(0, _this.settings.decimal + 1));
                    }
                });
            }
            return s.replace(/^\./, "0.")
        }
    };
    return InputNumber;
});