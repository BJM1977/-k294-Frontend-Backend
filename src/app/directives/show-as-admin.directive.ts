import {Directive, inject, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[pmShowAsAdmin]'
})
export class ShowAsAdminDirective {
  viewContainerRef = inject(ViewContainerRef);
  templateRef = inject(TemplateRef);

  constructor() {
    if (localStorage.getItem("ACCESS_TOKEN")) {
      const user = jwtDecode(localStorage.getItem("ACCESS_TOKEN")!);
      if ((user as any).roles.includes("admin")) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    }
  }

}
