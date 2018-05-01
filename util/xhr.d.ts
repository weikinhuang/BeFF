interface XHRThenable<T = any> extends Promise<T> {
  abort(): void;
}

export default function xhr<T = any>(options: string | JQuery.AjaxSettings): XHRThenable<T>;
