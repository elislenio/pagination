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

(function ($) {

    /**
     * Widget Factory
     * @external "jQuery.widget"
     * @see {@link https://api.jqueryui.com/jquery.widget/ The jQuery UI API Documentation}
     */
    $.widget("gmd.paginator", {

        options: {
            currentPage: 1,
            offset: 0,
            pageSize: 10,
            maxPages: 5,
            totalRecordCount: 500,
            messages: {
                pagingInfo: 'Showing from {0} to {1} of {2} records'
            }
        },

        _data: {},

        /**
         * Constructor
         * @external "_create"
         * @see {@link https://api.jqueryui.com/jquery.widget/#method-_create The jQuery UI API Documentation}
         */
        _create: function () {

            this._data = this._calculate(
                    this.options.currentPage,
                    this.options.offset,
                    this.options.totalRecordCount,
                    this.options.pageSize,
                    this.options.maxPages
                    );

            this.element.html(JSON.stringify(this._data));
        },

        /**
         * Calculates pagination metadata
         * @function
         * @param {number} pageNo - Current page number
         * @param {number} offset - Current offset
         * @param {number} rowcount - Total record count
         * @param {number} pagesize - Size of the page
         * @param {number} show_pageset - Number of pages to show
         */
        _calculate: function (pageNo, offset, rowcount, pagesize, show_pages) {

            var data = {};

            var currpage = pageNo;

            // Calculate offset based on pageNo
            if (currpage)
                offset = (currpage - 1) * pagesize;
            else // calculate currpage based on offset
                currpage = (offset / pagesize) + 1;

            if (offset >= rowcount) {
                currpage = 1;
                offset = 0;
            }

            var maxpage = Math.ceil(rowcount / pagesize);
            var pageOffset = Math.floor(show_pages / 2);
            var firstpage = currpage - pageOffset;

            if (firstpage < 1)
                firstpage = 1;

            var lastpage = firstpage + show_pages - 1;

            var overflow = lastpage - maxpage;

            if (overflow > 0) {
                lastpage = maxpage;
                firstpage = firstpage - overflow;
                if (firstpage < 1)
                    firstpage = 1;
            }

            var firstrec = ((currpage - 1) * pagesize) + 1;
            var lastrec = currpage * pagesize;

            if (lastrec > rowcount)
                lastrec = rowcount;

            var pages = [];

            for (var i = firstpage; i <= lastpage; i++)
                pages.push(i);

            data.firstRec = firstrec;
            data.lastRec = lastrec;
            data.rowCount = rowcount;
            data.currPage = currpage;
            data.offset = offset;
            data.lastPage = lastpage;
            data.pages = pages;
            data.totalPages = maxpage;
            data.shownPages = show_pages;
            data.pageSize = pagesize;
            data.info = this._formatString(this.options.messages.pagingInfo, firstrec, lastrec, rowcount);

            return data;
        },

        _formatString: function () {

            if (arguments.length === 0)
                return null;

            var str = arguments[0];

            for (var i = 1; i < arguments.length; i++) {
                var placeHolder = '{' + (i - 1) + '}';
                str = str.replace(placeHolder, arguments[i]);
            }

            return str;
        }
    });

}(jQuery));