"use strict";

/**
 * PAGINATION widget
 * @version 1.0.0
 * @license MIT License
 * 
 * Copyright (c) 2019 Guido Donnari (gmdonnari@yahoo.com.ar)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*******************************************************************************
 * BOOTSTRAP extension for PAGINATION widget
 ******************************************************************************/
(function ($) {

    $.widget("gmd.twbspaginator", $.gmd.paginator, {

        options: {
            debug: false,
            first: '&lt;&lt;',
            previous: '&lt;',
            next: '&gt;',
            last: '&gt;&gt;',
            pages: true,
            gotoPageInput: true,
            pageSizeInput: true,
            pageSizes: [10, 25, 50, 100, 250, 500],
            onLoad: function (data, pageSizeInput, gotoPageInput) {
                console.log('twbspaginator loaded');
            },
            onPageChange: function (number, offset, data) {
                alert('Change to page number ' + data.currPage);
            },
            onPageSizeChange: function (size, number, offset, data) {
                console.log('Change page size to ' + size);
            },
            messages: {
                first: 'First page',
                previous: 'Previous page',
                next: 'Next page',
                last: 'Last page'
            }
        },

        _$container: null,
        _$ul: null,
        _$first: false,
        _$previous: false,
        _$next: false,
        _$last: false,
        _$current: false,

        _$pageSizeInput: null,
        _$gotoPageInput: null,

        /***********************************************************************
         * WIDGET
         **********************************************************************/
        /** @constructs Widget */
        _create: function () {

            this._$container = $('<div />')
                    .addClass('dl-pagination');

            this._$ul = $('<ul>').addClass('dl-pagination-ul pagination')
                    .appendTo(this._$container);

            this._load();

            this._$container.appendTo(this.element);
        },

        /***********************************************************************
         * PRIVATE METHODS
         **********************************************************************/
        _debug: function (message) {
            if (this.options.debug)
                console.log(message);
        },

        _load: function () {

            this._debug(this.options);

            this._data = this._calculate(
                    this.options.currentPage,
                    this.options.offset,
                    this.options.totalRecordCount,
                    this.options.pageSize,
                    this.options.maxPages
                    );

            this._debug(this._data);

            this._$ul.empty();
            this._createLeftControls();

            if (this.options.pages)
                this._createPages();

            this._createRightControls();
            this._createPageSizeInput();
            this._createGotoPageInput();
            this.options.onLoad(this._data, this._$pageSizeInput, this._$gotoPageInput);
        },

        _pageChange: function (number) {
            var offset = (number - 1) * this._data.pageSize;
            this.options.onPageChange(number, offset, this._data);
        },

        _changePageSize: function (size) {
            var offset = (this._data.currPage - 1) * size;
            this.options.onPageSizeChange(size, this._data.currPage, offset, this._data);
        },

        _createLeftControls: function () {
            var self = this;

            if (this.options.first) {

                this._$first = $('<li>')
                        .addClass('dl-pagination-first')
                        .html('<a href="#" aria-label="' + this.options.messages.first + '" title="' + this.options.messages.first + '"><span aria-hidden="true">' + this.options.first + '</span></a>')
                        .appendTo(this._$ul);

                if (this._data.currPage <= 1) {
                    this._$first.addClass('disabled');
                } else {

                    this._$first.click(function (e) {
                        e.preventDefault();
                        self._pageChange(1);
                    });
                }
            }

            if (this.options.previous) {

                this._$previous = $('<li>')
                        .addClass('dl-pagination-previous')
                        .html('<a href="#" aria-label="' + this.options.messages.previous + '" title="' + this.options.messages.previous + '"><span aria-hidden="true">' + this.options.previous + '</span></a>')
                        .appendTo(this._$ul);

                if (this._data.currPage <= 1) {
                    this._$previous.addClass('disabled');
                } else {

                    this._$previous.click(function (e) {
                        e.preventDefault();
                        self._pageChange(self._data.currPage - 1);
                    });
                }
            }
        },

        _createRightControls: function () {
            var self = this;

            if (this.options.next) {
                this._$next = $('<li>')
                        .addClass('dl-pagination-next')
                        .html('<a href="#" aria-label="' + this.options.messages.next + '" title="' + this.options.messages.next + '"><span aria-hidden="true">' + this.options.next + '</span></a>')
                        .appendTo(this._$ul);


                if (this._data.currPage >= this._data.totalPages) {
                    this._$next.addClass('disabled');
                } else {
                    this._$next.click(function (e) {
                        e.preventDefault();
                        self._pageChange(self._data.currPage + 1);
                    });
                }
            }
            if (this.options.last) {
                this._$last = $('<li>')
                        .addClass('dl-pagination-last')
                        .html('<a href="#" aria-label="' + this.options.messages.last + '" title="' + this.options.messages.last + '"><span aria-hidden="true">' + this.options.last + '</span></a>')
                        .appendTo(this._$ul);


                if (this._data.currPage >= this._data.totalPages) {
                    this._$last.addClass('disabled');
                } else {
                    this._$last.click(function (e) {
                        e.preventDefault();
                        self._pageChange(self._data.totalPages);
                    });
                }
            }
        },

        _createPages: function () {

            var self = this;

            for (var i = 0; i < this._data.pages.length; i++) {

                var pageNumber = this._data.pages[i];

                var $page = $('<li>')
                        .addClass('dl-pagination-number')
                        .html('<a href="#" aria-label="Page ' + pageNumber + '" title="Page' + pageNumber + '"><span aria-hidden="true">' + pageNumber + '</span></a>')
                        .data('pageNumber', pageNumber)
                        .click(function (e) {
                            e.preventDefault();
                            self._pageChange($(this).data('pageNumber'));
                        })
                        .appendTo(this._$ul);

                if (pageNumber === this._data.currPage)
                    $page.addClass('dl-pagination-current active');
            }
        },

        _createPageSizeInput: function () {
            var self = this;

            if (!this.options.pageSizeInput) {
                this._$pageSizeInput = null;
                return;
            }

            this._$pageSizeInput = $('<select name="dl_page_size"></select>')
                    .addClass('form-control');

            //Add current page size
            if ($.inArray(this._data.pageSize, this.options.pageSizes) < 0) {
                this.options.pageSizes.push(this._data.pageSize);
            }

            this.options.pageSizes.sort(function (a, b) {
                return a - b;
            });

            for (var i = 0; i < this.options.pageSizes.length; i++) {
                this._$pageSizeInput.append('<option value="' + this.options.pageSizes[i] + '">' + this.options.pageSizes[i] + '</option>');
            }

            //Select current page size
            this._$pageSizeInput
                    .val(this._data.pageSize)
                    .change(function () {
                        self._changePageSize(parseInt($(this).val()));
                    });
        },

        _createGotoPageInput: function () {
            var self = this;

            if (!this.options.gotoPageInput) {
                this._$gotoPageInput = null;
                return;
            }

            this._$gotoPageInput = $('<select name="dl_go_to_page"></select>')
                    .addClass('form-control')
                    .change(function () {
                        self._pageChange(parseInt($(this).val()));
                    });

            // same as pagination
            var pageNo = 1;
            if ($.inArray(pageNo, this._data.pages) < 0) {
                this._$gotoPageInput.append('<option value="' + pageNo + '">' + pageNo + '</option>');
            }

            pageNo = self._data.currPage - 1;
            if (pageNo > 0 && $.inArray(pageNo, this._data.pages) < 0) {
                this._$gotoPageInput.append('<option value="' + pageNo + '">' + pageNo + '</option>');
            }

            for (var i = 0; i < this._data.pages.length; i++) {
                pageNo = this._data.pages[i];
                this._$gotoPageInput.append('<option value="' + pageNo + '">' + pageNo + '</option>');
            }

            pageNo = self._data.currPage + 1;
            if (pageNo < this._data.totalPages && $.inArray(pageNo, this._data.pages) < 0) {
                this._$gotoPageInput.append('<option value="' + pageNo + '">' + pageNo + '</option>');
            }

            pageNo = self._data.totalPages;
            if ($.inArray(pageNo, this._data.pages) < 0) {
                this._$gotoPageInput.append('<option value="' + pageNo + '">' + pageNo + '</option>');
            }

            this._$gotoPageInput.val(this._data.currPage);
        },

        /***********************************************************************
         * PUBLIC METHODS
         **********************************************************************/
        reload: function (options) {
            $.extend(true, this.options, options);
            this._load();
        }

    });

}(jQuery));