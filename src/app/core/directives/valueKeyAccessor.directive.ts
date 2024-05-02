import { Directive, ElementRef, Input, Optional, Renderer2, forwardRef, Inject } from "@angular/core";
import { COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    selector: "input[valueKeyAccessor]",
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => valueKeyAccessor),
        multi: true
      }
    ]
  })
  export class valueKeyAccessor extends DefaultValueAccessor {
    @Input("valueKeyAccessor") propToDisplay;
  
    override writeValue: any;
    constructor(
      _renderer: Renderer2,
      _elementRef: ElementRef,
      @Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
    ) {
      // Refer signature from https://github.com/angular/angular/blob/9.1.11/packages/forms/src/directives/default_value_accessor.ts#L36-L156
      super(_renderer, _elementRef, _compositionMode);
      // overwriting the writeValue    
      this.writeValue = value => {
        value = value && value[this.propToDisplay];
        const normalizedValue =
          (value === undefined || value === null) ? "" : value;
        super.writeValue(normalizedValue);
      };
    }
  
    ngOnInit() {
      this.propToDisplay = this.propToDisplay || "name";
    }
  }