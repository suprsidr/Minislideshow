/**
 * jQuery Minislideshow - v4.0.1 - 8/20/2012
 * http://www.flashyourweb.com/
 *
 * Copyright (c) 2012 "suprsidr" Wayne Patterson
 * License: http://www.opensource.org/licenses/mit-license.php
 */

(function($){
    $.fn.minislideshow = function(options) {
        var opts = $.extend({}, $.fn.minislideshow.defaults, options);
        opts.delay *= 1000;
        opts.resize = opts.resize == true?1:0;
        return this.each(function() {
            var el = this, images = {}, paused = true, hoverpaused = false;
            var playbtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAYAAAARIY8tAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjJCOThBRDhEQzM4MTFFMThDMzZCQ0VBNzIyMzdENTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjJCOThBRDlEQzM4MTFFMThDMzZCQ0VBNzIyMzdENTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMkI5OEFENkRDMzgxMUUxOEMzNkJDRUE3MjIzN0Q1MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMkI5OEFEN0RDMzgxMUUxOEMzNkJDRUE3MjIzN0Q1MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkzeBkAAAAJESURBVHjanNZLSFRRHMdxR1QqrRzsBdkiVIweZERI9H4txBCqTQgKIYEb2xSYuGjVsqCooEVtoxYRRNaykB64CRLKasCiCBc6jmJaZk3fP/1GLsdzZqa58GHm3nvO+d/H+f/PjaXT6aIs23rsRjNqsBzj+Iw+9GMYf0IDxAIBVuAcOvR/EO8wgUrUYhtSuI1L+OaNYAEce/AVv3EFG1GBYp2Pab8elzGHL+q3YDz3wDF8xwC2+jp4bMErTKI5W4BGzOAe4nkOnlGuftPY6wuwGB/wuoDBM5ap/xtUugHOYxYHPB1rsDLPIDvS/7bOaIAqDOJBoFMHEjgZedHZ3NJLnw+wT1GPBjq067zdYR/25whgLzqFIygrZqbuxA8MBHKlNPLbhIe4itWB9i8xi12WQxagTkk0Fegw7exXoAvP9LvGOZ+Uast8CxDXgV+BAKFaUq8M7lbQ6DaKKqyyAJOqMSWhchI4PoKLuI4Z51xcNWvMBk3gBMo9DW1b4uz/xH1cwEdP+6WqX3YBKbuD57rF7YErjT66F2hDe2DwIk2aRZo0yWge3AlMu9MYwRllfK48uIZRm6LRTO5VHWr0dNiEujwzebPypcctFVZ+P6FfhauQWmRX/BTv9VQWVNNDytgbBQQpwU2tDU3Z1oNTavQE1XkOvk4lxBaotlwLjmnR4jGFbg1Q5rQpxVqcVbsxHPddQGhN3oBetKqu2FQeiqzJ9gFwEHO4q4RL/M+in8ngBhzWV0WtMj6pr4pHeIy3CuTd/gowAKS+KmpvQq1cAAAAAElFTkSuQmCC';
            var pausebtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAYAAAARIY8tAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzhFMEYxOTBEQzM5MTFFMTkxODlDNEU1N0FCMUYzMEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzhFMEYxOTFEQzM5MTFFMTkxODlDNEU1N0FCMUYzMEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozOEUwRjE4RURDMzkxMUUxOTE4OUM0RTU3QUIxRjMwQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozOEUwRjE4RkRDMzkxMUUxOTE4OUM0RTU3QUIxRjMwQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp7Grc4AAAIvSURBVHjarNZPSFRRFMdxx6ahGDOHiSCyhTRRhFFREVEZqS1kQqhlEBRt2idkuHZZ0CZoUfsCoU1Ty0BCcVOo+SeS7A/RIicT/4Q5vr4nfyOv651pePbgg+N995yjb+4998WCIKgqczXgFLLYja34jg/IoRfvsVwqQaxEgW3owDV9HsIofqAOGRzGNB7iNr54K1gBx2l8RgF3sR81qNb9mH7fiztYwifFrcnnDlzAHAZw0BfgcQD9mEG2XIHjWMBjpCpMXpRU3DyafAU24y1eRUheVKv4QdS5BTqxiLMRkxcdC1au6+ECaQzhiSegC73owQ6NZTS3X/fdmAf60lcLnFHV857JPbo3jUaNHdWzDvTc3Zis5p9DopqVegI/MeBZxUvhFa2fhdC4bxP1YREnbQ9ZgT3aRLNV/+fKS73tfCuQ0sCviAktR60z9g1pbLebM+ox8YgFrA/NOWMp9awpK/AO+5Bcx2MphD5vUf/6ar3KCrxEDY54AuPOo7BrQ2g85omxRbNJiyZvQYMYxhXP5An9h28wrzFbDK/xEZOemHZ9n7k/MaENtaB+tJ6d3KiOcMttFdZ+J7VrkxGTJ/AC4+oOa7ppi3bnvQhF4rivs6Gt3HlwVZOeo77C5LuQ0wF1+V8HjmnX4TGLm0qQcOZsxE7c0LwpXPT9AaXOZNsXXbikvmJLeSx0JtsLQLN60iN0a7VVfOgX1/ghtOqtIqMdn9dbxVM8w4jTFP+6fgswAFAL5QJ6hX8rAAAAAElFTkSuQmCC';
            if(opts.url === '') {
                $(el).empty().append('<center><strong>Error: Missing Url</strong></center>');
                return;
            }
            $(el).empty()
                .css({
                    width:opts.width,
                    height:opts.height,
                    position: 'relative',
                    margin: 0,
                    padding: 0,
                    'background-repeat': 'no-repeat',
                    'background-image': 'url(data:image/gif;base64,R0lGODlhIAAgAKUAAFRWVKyurISChNza3GxubMTGxJyanOzu7GRiZLy6vIyOjOTm5Hx6fNTS1KSmpPz6/FxeXLS2tIyKjOTi5HR2dMzOzKSipPT29GxqbMTCxJSWlFxaXLSytISGhNze3HRydMzKzJyenPTy9GRmZLy+vJSSlOzq7Hx+fNTW1KyqrPz+/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBwArACwAAAAAIAAgAAAG/sCVcEgsCg+DgcnIbBIPFgxgChhZDk6jx0IxPFYJCHUM2ESyR8m09HWQ3wBLdjKaUr4kODzRPNTLEysHYlQbJQkTJg8mIAYIG1hGHVQlQimFBiJNDyQcRgNlUw1CBFMYA0YHHgtfKypGBoWvIqZLQxOOoRsnGa1EpVMCQhOARB4SUm8fHkUblMMAfEwmKQhkGyhDD2OVKxcfvkwXFmQQC0PWUxJDo2grIM5UwkICVB/uRg3xU6grEWOR8A3hMMaAkAfpAHjCh+LCwQ/2VmTLQAVDOCcNKDhcQXEKggsUhJCbkgLfAQDdHsRD4AFABiEEy7TLsg1AOzUAlgFAYGuCoYQNEPo5oQWgg6UpBk7m1CRERIUMG5sQK/MlgagVyQgEQvNKiNUpzKwyEFkoRdQiKjKcEYITQIUVKcwJMbEPAAQDBRQ9ONDAAQZIc8eM0jDTn543a1eUGLPEFpFYh5EOATEGQxYOdcdsWLhiQF3OTUzkwuS4QsKdFzdNaABiQtcVIiALFmjEqYbMG0DQJnJhMRwGW3cTmWDhBAYMDAwUZhIEACH5BAkHACsALAAAAAAgACAAAAb+wJVwSCyKCgELp3EpOp/FhQJArUIsTehz4REmNtUwdTTQDlUJAuawiojfAEhZa2JQuyiw+FOyWAwMGyMiUCYjVBYrDx9hGykmTiIZJE8PFFQbhA1hEoRmT25UEkIhVSlEKhWAGAQCAZBFKhhVCUInVKdDA4xwBllCA2FzjAJEIhwpJbx7sCsJYbCBC3QWelUEngHQQiUlnysmHWLeKxzCQiQN34oWjRMrIGEZQiIP60IGYYkH1uTrzYuqfBAiocqGX58KlLC3YhMmYGFyfRMBQIIKIXaoKFqRwuC0dQQAcPBCBcGKRCcFevokIA4hE1SKEagFDwEVBiu13BIpBEyVLQob5jxIIGHEhzlaeBVbMQIBoSkIUKxTwWaFCj0mmVJyhikAQygLTsBCYZDdEBEQriWoSmSAhg1LV7wtqejikI57FBjQ0MHmHSEmrDF4oiIjnDAjCUaEcsHwYZTlGjVz8iCFtTAYQAx5pm9iAgEYEPDJwPBCvjAMvt4zxuEQ6pyrG+4Mg4CD6thCFnBQIECAAdJmggAAIfkECQcAKgAsAAAAACAAIACFVFZUrK6shIKE3NrcbG5snJqcxMLE7O7sZGJkjI6MvLq85ObkfHp8pKakzM7M/Pr8XF5ctLa0jIqM5OLkdHZ0pKKkzMrM9Pb0bGpslJaUXFpctLK0hIaE3N7cdHJ0nJ6cxMbE9PL0ZGZklJKUvL687OrsfH58rKqs1NLU/P78////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv5AlXBIJC42CQGn4ngUn1AjB0CtAkSkqHYI0li/gIRzKwyRDioLuKrxAiSp7eMEqahKkC+iYAmVBycOWiEMVxcqBVYaG35kRQ+FAAEqF24AHhNEDxYnBRURHVENVWgOVR6NlBV5Xx4WRQduHkIbVAglQxMYa1UZYyq1VAlCJ1QGQ5sWKAYnkV8JcSpTVAW0l2QlBZZUG0K71EKmCo4qHd9UGn4iVRJCDxCpZIRW3R5VGEMRjtEqIecCKkZYyaSCn5YIIIYMqIJAhQErdsjdAfAhmkAqKh6cSydRBQUAESegEwLCyoiOiQCgEGKPwZAKViaRC0ZBSCI7HZwUqyKTDKGJKgNURNCAK8IJIQMEsMO1JUKVbiSqqSg5TkgJZp9+DXklBCa4AYdUiATQwCCUBx/aCXF2soi9SyuhpLBgL4uKA1akElFghUAFCx0WTLDw4ZuIMaOqVCWSwhmvKlzxWGFapMS5xxEfKGWnpYTjL4uEpEiJjvJZBZepSCAYQoIiro4mKNiwoY9oA5cRwO445MKJyxoKmOY9JISFDRVqx3sSBAAh+QQJBwArACwAAAAAIAAgAAAG/sCVcEgcTiwnDOZk8RSfUOJBAqhaqx1TdCscIK5gAALFhU4g4Y3AwuFYFNqyKfJQfcCYzKMMjWxIKxlgKXtDFwMVDXFRBgAYeydWGyBEFQIbVxgpF08cVRYrF5hVlEIiVGFVIw1EJqMVKwtWoKZ3qZIFQyFWWgNVCIUrDSgiDw8TCahXG04qX1WcJlUpfCYlYAwr0lYiK84Ai2Ugz1XDVxNCJRh8RBOjAAYoVxlCHhJlKgkHQw1WH9tVSgwZwIcEBEBCLPxaMUJSN3beMACgJQLTOoWzICasEkFIo2yuJBGE2A/ABi0VJgpJkCkclwNWDKyoiG6jFQw18Y0CtkLDnZA9Gd5tiKAiSqEH50IN0bBHRIo7mAiQKYICIUwrpYZQUBBMhAkTwfhtYLUCxJWsGz+MjHLBgUlOK3ZZWVvPioQKYbUFaAhAgZAH5DbkXaFgGQMJCgRIlFTTkxWBT0QsvmWFg5CQVnIWmTD5FkVbn14qA4OA3kwGVyQULTPBwIcNGxAISFAIBF+ThDRCGXBipwHNuoscGNBgwuooQQAAIfkECQcAKwAsAAAAACAAIAAABv7AlXBIFC5SjBEEIyE9itDo8GIAWK/WUUHKFR4+WOwGAXF0oxdwmMGZPFcX1bkYCn8ac6mItDKFS28rIgEnEAAQDA4mUigIGSsBWAZDDykbYVYbFhdFKBsbnAJXAm8PEphrIkMiIwACQhiZi0IlAB8CAgyXmCdvdQAhQq0AFkMmIIErDwMGu1ccyrspQmqzZyKnVwgiFVdmKyUbH3lDCVgZkVYlQiAAGtcHROZWBhZX48oEAWcPJxITQ6q4SnFlw6wG0M4sALBhnzIErjJgmeYljwYrFDkAkCACC4J45FZMuAJC0AZoCrCsC7kCIgAMT04sWLHAGYCE5DpceYSiXKaYFHLyCASwkohGLAIAShkw5JetKAPUZFJQIdmKAwSG1LKCoMiAgxYEfGCgIUOyA0mGMLiCociCEUzPTAAjQcgFZ6+KgDEAEooIB7v4rCAxEcq8jRFQLJiAIoEEZyOePJBqEIqKtagwlVxxGMCkKCZiZb5SbMUAZx+sEkE7+qaQCS5tqeqiIoHUK/+EZDDE0IJqLhMScOAAYvYDCxgISOAwm6XzIkEAACH5BAkHACsALAAAAAAgACAAAAb+wJVwSFxdEh0MBCMIHIrQKDGBAFivgI3jIe2uVBrsFVMKJFBeaUgMkAzS6YoY0yAOAiWJJmGCryhYHyJDIB9sbX1QKnUeWBiDXwaHVxAgRQ8dHCscWG9CkpNXG5ZCKhIAb2tWBkMJGwwWHBkJFgwbYhBPKwlWXGFWiQ8ciUUiKbdXrA8jWUIWtwx+QiYCoiIFVhtC2AAp0kIPoAAg4oMitxlxChlcKw8lVinVVnUra/VeFgAYFUIiGAAsnLhiwR8/OA8MAXAgBES3U1YQtBtQwI8cK5oeYAARAIumUtIIZJuwIsWFCVg2LPgmJMUVCUaEzLMiiOXFLLpWTEBmhQGksS7tUF4hJSSDGAQZVHQxEUHIAY9FQPCkmSAnkQ4FV5jA4q2YgakAECRQOsRl15sAEhQJ1oBDigQN2g1xYCVdyU5FEhiAJMVEhyu6AEUkO0QEBAQpVhbxEIInzBUDoELpaAVDBw0lBDATQ/IBgysf5BJ5MDDUlY8uI5KUcmHmpK4ZkH1YDTRFFTYbhXAKy0G0FxEJJHzA8KEEiIkcEgwgzLI5kSAAIfkECQcAKwAsAAAAACAAIAAABv7AlXBIXA0sJ8KnE1gUn1Di4gSoWquGS3QrrECugE2pYOJyURuwoSx8eECFwcMsvGCuG9DQpPlaxRNmAXgDQxxpYWAADipbd1Z6QgaKeAAKjURlC1clhmCIiilEKAorDVdsJhsfKQMiQiYgFgh4gSsmEA4rIFYSQwkgc1APh1YGQgIAESsoVglDwlwmH1UIblXLIoi2UQ8ZKNEiDFUmIVW6K8kAr2cQYk4rIrQN4wAdQrwA0VunYcu7AAY82iAsGTszDqygO3HgEYAMQkQQKETngcMCRlbUA0BA2AEUdIRwsGJNiIUrokJmuvJshQc8kVQKoVZFwJAOMEM2uElyD5utKyG0bHnQUUiJK9EGgKqWAt6TCADgHbVSZAJNMBgkUBQyIQ08dQAwPFGRgQEoBAY8ZBpRZc6DnwCOFRH2wMQANkQGsAXwQUgzKzuLBEiwj8iBSVY4GLVi84mqESFALBBhwgMJCUsRvJpAEm8RqJQUQXxQD8FWKOZCWxH1QEMVCZ6jJFiKZ7SBDwZOmzlgwWHYFAdlQrHrSviKIAAh+QQJBwArACwAAAAAIAAgAAAG/sCVcEh8VCySjiZxIDqfUFViBKhaGSio1nnpWKuIlGhLFj5OX0BpvHpkFBjI6JQylVeOzZczBFHTABshF1smelZ8QhaAaR9NUAFfAkMpjIAUD1AMVht2KwOHGBIGFiUMh1YWTiorqAZDAhsGE08iCR+cjysWmV8DQiYCnloPCYeJGQhCEFUbmSsiz2UTCAASKxcIyiubAAxlAx8EChnPExsEKwmBrJUAk2UH3SMgQgUYK14ACyuG73fQcFVxICTFCgxVEghxAOADwBULUPHJdOhbm1iEALoL5EFItSoNhFyQUOGhCFTXuFn5II3fwxK58Hwp8bBNxgxf6i1IY4DVoB0QGYQM2CPEQBphdxRoAPbFYMA0Gyy4hLLzBFMrCoEJbFTCQQA2K1SgsTjUyq8hF4wy+pBlyKJ/K0hYQeCTiAkOAj5g+GCgQt0VG1WtgFklUc0VByT4ghZKGpEEJDISWWABlTdFYIY5ETFiwwkNFkIo2Lp4QpUPmp+gsGxJoQgMGDg41jKACutmQT95+FvmQmVAJVIfNtOAQ4oUIMDeCQIAIfkECQcAKwAsAAAAACAAIAAABv7AlXBIfDQigUjjQmw6nyuRBQKoAhCOB3RLRI2s14x2dSikUhGUijtsbMASkdDTAVdHgTH0QLWWxhx2dh8LWwpgDGMWgoIIhU4Hb1UbJkIFjIwfekMJYBZCDxhVHykNJqcNKQxgHE4GYJUrGQAfDVsDqwAYa0SHVQxDEg68Ww+BAAOgKCslVp9CIE4PCSkBBXJCGRsJQhbcKVbcXAsCkx0TQhwBKyYArShWGWxC4FatK+jgGisqogDi8+pVSTHkBAAC0Ko8m7dCAphoKxBU8SDkFTCGZDZIwqBFkgJQzQ5gXLEo3oovVZYJSRBhHq8JYEqsqFMFA7YVm6C0FOKP1qaKTlY+3GRjAsIYh1UQRJFoBQPFeREAqHxVc6WdDRpiQVHx4V9FKwKGNBPEwEGGChUKECNRZd0KXwAIgqKKyekQE0x3dgVAqUmDvWA2WLgpgoAVW5EUQpnAwYIBCyA2Tei5QcsxTSOFXEghqYoBnF+EbqmQAoWcBwcqGOhjBYEcC4JzNlFBE9NhdhxEznuAFNMGiJmFkOgJB13wIhUsSBBQgoPxeUEAACH5BAkHACsALAAAAAAgACAAAAb+wJVwSFwdPJNLcclkmiwYgJQxID4ezaaKs5ECEBnhhXOCSDElVHao0ngBn4OQhHi/BaZ14P0RCUN2gQgeTQtdUhsTQnuBgnJLJW8cQhOHUh8SBiUCdV4dSw9miFgrEmccflYDJYdVRB5vBkIPABsppE0TDACyRCBvIEINEA1LKiYHuA8aH0W/XnkrGa5EDQSIFBxKKr0rSrBeQ7hFD1xeCAUruBrqhxtrRBMjbylDCwB+kVKp8CsmUV5ICEkBIFglKdT6DXizQc4JAOxWEARQr98QC28srIiyIZUBAARUWBQiwhKGjVK6cUkHj5o+KSZ2SakwxEQEkWs6KJL2pgGaICkIEvYb0WtCTxSWNgSzeG8EyTeKZHopEW2Ng33ezmE5yFACiQnJDgxQQ7KTIhNTh4Cw1AjOoxUfYa5ogKjqXICNJPDL4GUDlqsUl4jggFeKgKVCCtxZoSJKCZxOGoAYwE8dRmDSbI2zeCFBYQAMrqRY0G+BBAscAoRgwLbuyCEoRLUN+pqIiQ5tJditLcSDBQEYPgiwsBNeEAAh+QQJBwArACwAAAAAIAAgAAAG/sCVcEgsGo9I4oWkoHwcD+GhkEpFUKpkURWAAAAbknDQ+ZoBo0BUK2KYEQNh6kwHUBbJB8W8ia9CdXUjJkgWZxxCGYGBH2tEBxtmGFkPCHwlGRMmJhMJJZEAEUYBZwlCJF8bKY5FIhYbk0UCfCJCEgAfhForExgTRRhmDEMYDLVDDyAGAgwdDn4iHkWWXyVDH8dDFwW3Zwx+RQRmFkPSSBMndKZF3QAGu0Mqc2diQigril8S8ETzqXgmhl2ghoEfkXYA9nEAUCsfgF8GV4igBuZACQCIVhj48g5eNgdnMswacWGFPDC6tAS4t8IEKAApyrgbMkCAgCxaHHzA+WEcqKAv64QsyIbkYgMhF7+kKHAo4opgHf2BqHRGQkotE74MWzFvQ60IdDZoQMHqAgg8QjYCICDkZ0cVs+psoCDgRE8FQ1x++SBkFoIDQ0TEXZSw5IoHbvQdhrDhKJEHrwKpWqMi6RdEICA4NmIiBYNICBhwyHZBwZkNhBIAdjoERLAz5CI+MPzAA4eedBqxDgHByyJsrIUUGPHyjAFWrB8kkIABQegUV5EEAQAh+QQJBwArACwAAAAAIAAgAAAG/sCVcEgsGo/I4qKQ8AgfGQUBgRFwDsmiKvEBAFKqVWHkLXs3jkd2dTiVSUKLee5liJImTDklTNH/FGpGDxRlDGoDdBglBhYlXV4ORxFmDUICZRsWJkYiHBgbWEQqel4fQiYAGwAld0kPFhFFiXtCGV4cRQ8DJBwJKIKiQwmVfQC5RAkIcxAhrkR+ZZwrFh1HJhGQZQgVRRxm0wnCgxnLmQVEBeBPaysL2qoLQwerXpbtQyKlXgLsmF588A2ZYM7LhAt8BtQ7hS+MkG97KmAIEw3AvTUZnKx4UFBCAAAZhBio4zALCAwX4hjyMyLlinJf2qmzIKRBGSteJDi8kKBDobcstyCoEVGmRIUyGkrikwPgZ70MD+oBEDANX6GYK5YhUBPCDJpxQ0xwcDihTIiNuISIKKgKwIlYGSKEYAAAjhAN9Wh6mCpoRQOpf7yUGELLS4IVHAQ8EwKCLR0DwciUmbACRF8iJkr8+QBiHjwG+EwkMCChBIcBRBo4viiwCAoJdGi2FoIiQoASkueUUCoQFuBth2cXORBAAAIqEhJcPhIEADs=)',
                    'background-position':'center'
                })
                .on('mouseenter', '.anchor', function(e){
                    e.preventDefault();
                    hoverpaused = true;
                    $(this).find('.mini-control, .mini-title').fadeIn('slow');
                })
                .on('mouseleave', '.anchor', function(e){
                    e.preventDefault();
                    hoverpaused = false;
                    $(this).find('.mini-control, .mini-title').fadeOut();
                });
            if (opts.provider == 'xml') {
                if(opts.recursive && opts.url.match(/page=/i)){
                    opts.url = opts.url.split('?')[0];
                } else if(opts.recursive && opts.url.match(/&g2_offset=/i)){
                    opts.url = opts.url.split('&g2_offset=')[0];
                }
                var i = 0;
                images.length = 0;
                getXmlItems(opts.url);
            } else if(opts.provider == 'rest'){
                if(!opts.url.match(/mode/i)){
                    var args = {mode: 'members'};
                } else {
                    var args = {};
                }
                $.ajax({
                    url: opts.url,
                    data: args,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(data){
                        images.length = 0;
                        $.each(data, function(i, item){
                            // Store our items in an object
                            images.length++;
                            images[i] = {
                                full: {
                                    url: opts.resize == 1?item.entity.resize_url_public:item.entity.file_url_public,
                                    width: opts.resize == 1?item.entity.resize_width:item.entity.width,
                                    height: opts.resize == 1?item.entity.resize_height:item.entity.height
                                },
                                thumb: {
                                    url: item.entity.thumb_url_public,
                                    width: item.entity.thumb_width,
                                    height: item.entity.thumb_height
                                },
                                type: item.entity.mime_type,
                                title: item.entity.title,
                                description: item.entity.description,
                                link: item.entity.web_url
                            };
                        });
                        _populate();
                    },
                    error: function(e){
                        $(el).empty().css({
                            'background-image': 'none'
                        }).append('<center><strong>Error: ' + e.statusText + '</strong></center>');
                    }
                });
            } else if(opts.provider == 'g3rest'){
                $.ajax({
                    url: opts.url + '/item/' + opts.g3_itemid,
                    data: {output: 'jsonp', scope: 'direct', page: 0},
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(data){
                        var members = array_chunk(data.members, opts.g3_max_items);
                        if (opts.shuffle) {
                            members = shuffle(members);
                        }
                        $.ajax({
                            url: opts.url + '/items',
                            data: {output: 'jsonp', urls: JSON.stringify(members[0])},
                            type: 'GET',
                            dataType: 'jsonp',
                            success: function(data){
                                images.length = 0;
                                $.each(data, function(i, item){
                                    // Store our items in an object
                                    images.length++;
                                    images[i] = {
                                        full: {
                                            url: opts.resize == 1?item.entity.resize_url_public:item.entity.file_url_public,
                                            width: opts.resize == 1?item.entity.resize_width:item.entity.width,
                                            height: opts.resize == 1?item.entity.resize_height:item.entity.height
                                        },
                                        thumb: {
                                            url: item.entity.thumb_url_public,
                                            width: item.entity.thumb_width,
                                            height: item.entity.thumb_height
                                        },
                                        type: item.entity.mime_type,
                                        title: item.entity.title,
                                        description: item.entity.description,
                                        link: item.entity.web_url
                                    };
                                });
                                _populate();
                            },
                            error: function(e){
                                $(el).empty().css({
                                    'background-image': 'none'
                                }).append('<center><strong>Error: ' + e.statusText + '</strong></center>');
                            }
                        });
                    }
                });
            }

            function _populate(){
                $(images).each(function(i){
                    var o = opts.fullsize?images[i].full : images[i].thumb;
                    var w = o.width;
                    var h = o.height;
                    var r = h/w;
                    if(w > opts.width){
                        w = opts.width;
                        h = w * r;
                    }
                    if(h > opts.height){
                        h = opts.height;
                        w = h/r;
                    }
                    // Append our actual display element
                    var div = $('<div />')
                        .attr({
                            'ref': i,
                            'data-title': images[i].title
                        })
                        .data(images[i])
                        .css({
                            position: 'absolute',
                            display: 'none',
                            width: w,
                            height: h,
                            top: (opts.height - h)/2,
                            left: (opts.width - w)/2
                        })
                        .appendTo(el);
                    images[i].link = opts.link ? images[i].link : null;
                    if(opts.altlink != '') images[i].link = opts.altlink
                    var a = $('<a />')
                        .addClass('anchor')
                        .css({
                            display: 'block',
                            position: 'relative',
                            width: w,
                            height: h,
                            border: '4px solid transparent',
                            'border-radius': opts.radius
                        })
                        .attr({
                            href: images[i].link
                        })
                        .appendTo(div);
                    var img = $('<img />')
                        .attr({'src': o.url, 'alt': images[i].title}).css({
                            width: w,
                            height: h
                        })
                        .css(opts.dropshadow)
                        .css({
                            border: 'none',
                            'float': 'left',
                            'border-radius': opts.radius
                         })
                        .appendTo(a);
                    var title = $('<h2 />')
                        .addClass('mini-title')
                        .css({
                            position: 'absolute',
                            display: 'none',
                            top: 0,
                            width: '100%',
                            margin: 0,
                            font: w/opts.fontscale + 'px/1.618 '+ opts.font,
                            padding: 0,
                            color: '#fff',
                            'background-color': 'rgba(0,0,0,.5)',
                            'text-align': 'center',
                            'text-decoration': 'none',
                            'border-top-left-radius': opts.radius,
                            'border-top-right-radius': opts.radius
                        })
                        .text(images[i].title).appendTo(a);
                    var control = $('<a />')
                        .attr({href: i})
                        .addClass('mini-control')
                        .css({
                            position: 'absolute',
                            display: 'none',
                            right: 4,
                            bottom: 4,
                            height: 24,
                            width: 24,
                            margin: 0,
                            padding: 0,
                            color: '#fff',
                            'background-color': 'rgba(0,0,0,.6)',
                            '-webkit-border-radius': '12px',
                            'border-radius': '12px'
                        })
                        .html($('<img />').attr({src: playbtn, title: 'Play'}).css({border: 'none'}))
                        .on('click', function(e){
                            e.preventDefault();
                            paused = !paused;
                            if(paused){
                                $(el).find('.mini-control img').attr({'src': playbtn, title: 'Play'});
                            } else {
                                $(el).find('.mini-control img').attr({'src': pausebtn, title: 'Pause'});
                            }
                        })
                        .on('mouseenter', function(e){
                            e.preventDefault();
                            $(this).css({opacity: .6});
                        })
                        .on('mouseleave', function(e){
                            e.preventDefault();
                            $(this).css({opacity: 1});
                        }).appendTo(a);
                    if(i === 3){
                        img.on('load', function(e){
                            // Kick off the show
                            $(el).css({'background-image': 'none'}).find('.mini-control img').attr({'src': pausebtn, title: 'Pause'});
                            $(el).find('div[ref="0"]').addClass('current').fadeTo(3000, 1, function(){
                                paused = false;
                                setTimeout(_swap, opts.delay);
                            });
                        });
                    }
                });

                if(isMobile()){
                    $(el).off('mouseenter mouseleave', '.anchor');
                    $('.mini-title, .mini-control').css({display: 'block'});
                }
            }

            function _swap(){
                if(paused || hoverpaused){
                    setTimeout(_swap, opts.delay);
                } else {
                    var j = $(el).find('.current').attr('ref');
                    j++;
                    if (j == images.length) j = 0;
                    $(el).find('.current').fadeTo(3000, 0, function(){$(this).css({display:'none'})}).removeClass('current').unbind('mouseenter, mouseleave');
                    $(el).find('div[ref="'+j+'"]').addClass('current').fadeTo(3000, 1, function(){
                        setTimeout(_swap, opts.delay);
                    });
                }
            }
            
            function getXmlItems(earl){
                $.get(earl, {}, function(data){
                    var next = $(data).find('atom\\:link[rel="next"], link[rel="next"]').attr('href');
                    var items = $(data).find('item');
                    if (opts.shuffle) {
                        items = shuffle(items);
                    }
                    $(items).each(function(){
                        i = images.length;
                        //i -= k;
                        if ($(this).children('media\\:group').length > 0) {
                            var MC = $(this).children('media\\:group').children('media\\:content')[opts.resize];
                            var MT = $(this).children('media\\:thumbnail');
                        }
                        else
                            if ($(this).children('media\\:thumbnail').length > 0 && $(this).children('media\\:content').length > 0) {
                                var MC = $(this).children('media\\:content');
                                var MT = $(this).children('media\\:thumbnail');
                            }
                            else {
                                var MC = $(this).children('media\\:content');
                                var MT = MC.children('media\\:thumbnail');
                            }
                        if ($(MC).attr('type').indexOf('image/') === -1) {
                            //k++;
                            return true;
                        }

                        // Store our items in an object
                        images.length++;
                        images[i] = {
                            full: {
                                url: $(MC).attr('url'),
                                width: $(MC).attr('width'),
                                height: $(MC).attr('height')
                            },
                            thumb: {
                                url: $(MT).attr('url'),
                                width: $(MT).attr('width'),
                                height: $(MT).attr('height')
                            },
                            type: $(MC).attr('type'),
                            title: $(this).children('title').text(),
                            description: $(this).children('description').text(),
                            link: $(this).children('link').text()
                        };
                    });
                    if (opts.recursive && typeof next !== 'undefined') {
                        getXmlItems(next);
                    } else {
                        _populate();
                    }
                }).error(function(e){
                    $(el).empty().css({
                        'background-image': 'none'
                    }).append('<center><strong>Error: ' + e.statusText + '</strong></center>');
                });
            }

            function shuffle(arr) {
                for(
                  var j, x, i = arr.length; i;
                  j = parseInt(Math.random() * i),
                  x = arr[--i], arr[i] = arr[j], arr[j] = x
                );
                return arr;
            }

            function isMobile() {
                if( navigator.userAgent.match(/Android/i) ||
                    navigator.userAgent.match(/webOS/i) ||
                    navigator.userAgent.match(/iPad/i) ||
                    navigator.userAgent.match(/iPhone/i) ||
                    navigator.userAgent.match(/iPod/i) ){
                        return true;
                }
                return false;
            }

            function array_chunk( input, size ) {
                for(var x, i = 0, c = -1, l = input.length, n = []; i < l; i++){
                    (x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
                }
                return n;
            }

            // Context menu
            $( el).on('contextmenu', function(e){
                e.preventDefault();
                var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEMyRDAyRURFMEFEMTFFMUE3RjhGNEIyRDkwQkQ0MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEMyRDAyRUVFMEFEMTFFMUE3RjhGNEIyRDkwQkQ0MzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QzJEMDJFQkUwQUQxMUUxQTdGOEY0QjJEOTBCRDQzMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QzJEMDJFQ0UwQUQxMUUxQTdGOEY0QjJEOTBCRDQzMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PneGIIoAAAI8SURBVHjaJJJLbhRBDIbtKle/JsxEJCHSBBAbduzgJpyEU3AC1uzYsuYEWbFiAQJFiCQoIEUwM/2qcj2MM7gtV6nlv1zd/4cvX78nck3bOueICBGttQZRRErJMaYUY+CgmxBCyYnaOCyoWRjjTHG2aDcRaMg+kinRlCnHKUxzmlVHtmlt02h1dV1VlQ7R+r+7lGJT0iyWImAoYq0jcTVULdYd1rUqXVW5ykku+hgBSSkzm4ImFowFTKTiWqk7TWxb0zbGUcxps+3HcWya+vD4BIwDMZjEZBDvCYmCIOUiHBFBIjaQzw4Xy8frH1dXfd9j02Wq7g6N+s1Avze79RGtH5w8f7R8elSvGmsRQpItl7PTZ+dfrj9fXNx/+CQZyrbKlung+BQX3eVm+Dl4KqmF1JJY1AtLKDhlszpdb3c9pzxzZDHE4Ni2bbdyzrbOvnqxrAwUgSQwJbjsy8df/tvN3zyOFknyRB7IiaWif6IK03i9rc+W1ZvzmzGDWjhl61P2LHO2A8uU0Oxi2XLuk4xifb18+2mjPutLWBymxTEvjrhZedcNQLsEQxaaYjYxU4hCUeHomd59HaA7uA2YCGNkhWIMsfc8cvKcyKeIHNDPEeTOaYQP34d7q26YJnRZg5lHP48cpsghRfI8gwUwwincCZQli39u1dECOCkdqpn9PIdJO3UgjTwnLFGS0xuxU1pVs2cPZL+owHuvxmtVctXpuFXzyYA1RrEGULtVhvt9VqSkQGEok2Zn8z8BBgDA0JLZeLjAtQAAAABJRU5ErkJggg==';
                var menu = $('<div />').css({
                    width: '160px',
                    height: '120px',
                    border: '1px solid #999',
                    position: 'absolute',
                    display: 'none',
                    color: '#222222',
                    font: '12px/1.618 sans-serif',
                    'z-index':1000001,
                    '-webkit-user-select': 'none;',
                    'background-color': '#f1f1f1',
                    '-webkit-box-shadow': '3px 3px 5px rgba(0, 0, 0, .5)',
                    '-moz-box-shadow': '3px 3px 5px rgba(0, 0, 0, .5)',
                    'box-shadow': '3px 3px 5px rgba(0, 0, 0, .5)',
                    'border-radius': '5px'
                })
                .html('<ul style="list-style:none;margin:0;padding:0 5px;text-align:center;">'+
                '<li style="font-weight:bold;">Minislideshow v.4.0</li>'+
                '<li style="position:relative;border-bottom: 1px solid #cccccc;"><a href="http://www.flashyourweb.com" ><img style="width:16px;height:16px;position:absolute;left:0;top:0;" src="'+logo+'" />flashyourweb.com</a></li>'+
                '<li class="playbtn" ><a href="#" ><img src="'+playbtn+'" />Play</a></li>'+
                '<li class="pausebtn" ><a href="#" ><img src="'+pausebtn+'" />Pause</a></li>'+
                '</ul>'+
                '<div style="position:absolute;left:0;bottom:0;width:100%;text-align:center;"><p>&nbsp;</p>&copy 2012 <a href="http://www.flashyourweb.com" >flashyourweb.com</a></div>')
                .appendTo('html');
                menu.find('.pausebtn, .playbtn').css({
                    position: 'relative',
                    'border-bottom': '1px solid #cccccc',
                    display: 'none',
                    height: '22px'
                });
                menu.find('a').css({
                    color: '#222222',
                    'text-decoration': 'none'
                });
                menu.find('.pausebtn img, .playbtn img').css({
                    width: '16px',
                    height: '16px',
                    position: 'absolute',
                    left: 0,
                    top: '3px',
                    'background-color': 'rgba(0,0,0,.6)',
                    '-webkit-border-radius': '8px',
                    'border-radius': '8px',
                    'float': 'left'
                });
                menu.find('.pausebtn a, .playbtn a')
                .on('click', function(e){
                    e.preventDefault();
                    paused = !paused;
                    if(paused){
                        $(el).find('.mini-control img').attr({'src': playbtn, title: 'Play'});
                    } else {
                        $(el).find('.mini-control img').attr({'src': pausebtn, title: 'Pause'});
                    }
                    bg.remove();
                    menu.remove();
                });
                if (paused) {
                    menu.find('.playbtn').css({display: 'block'});
                } else {
                    menu.find('.pausebtn').css({display: 'block'});
                }
                var left = e.pageX + 5,  top = e.pageY;
                if (top + menu.height() >= $(window).height()) {
                    top -= menu.height();
                }
                if (left + menu.width() >= $(window).width()) {
                    left -= menu.width();
                }
                menu.css({left: left,top: top}).on('contextmenu', function() { return false; }).show();
                var bg = $('<div></div>').css({
                    left: 0,
                    top: 0,
                    width: $(document).width(),
                    height: $(document).height(),
                    position: 'absolute',
                    'z-index': 1000000,
                    'background-color': 'transparent'
                }).appendTo('html').on('contextmenu click', function(){
                    // If click or right click anywhere else on page: remove clean up.
                    bg.remove();
                    menu.remove();
                    return false;
                });
            });

        });
    }
    $.fn.minislideshow.defaults = {
        url: '',
        provider: 'xml',
        width: 180,
        height: 180,
        delay: 5,
        recursive: false,
        shuffle: false,
        link: true,
        altlink: '',
        target: '_blank',
        fullsize: false,
        radius: '0px',
        dropshadow: {
            '-webkit-box-shadow': '3px 3px 5px rgba(0, 0, 0, .7)',
            '-moz-box-shadow': '3px 3px 5px rgba(0, 0, 0, .7)',
            'box-shadow': '3px 3px 5px rgba(0, 0, 0, .7)'
        },
        font: 'sans-serif',
        fontscale: 20,
        resize: false,
        g3_itemid: 1,
        g3_max_items: 24
    };

}(window.jQuery));
