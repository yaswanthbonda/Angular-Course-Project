import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editingItemIndex : number;
  editingItem: Ingredient;
   @ViewChild('myForm', { static: false }) slForm: NgForm;
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe( (index: number)=> {
        this.editMode = true; 
        // Because we only come inside of this subscription if we are editing something, 
        // so change the default value from false to true so that we will know the difference between editing and new
        this.editingItemIndex = index;
        this.editingItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name : this.editingItem.name,
          amount : this.editingItem.amount
        });
      }
    );
  }

  onSubmit(form : NgForm) {
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editingItemIndex, newIngredient);
    }else this.slService.addIngredient(newIngredient);
    this.editMode = false;
    form.reset();
  }

  onClear(){
    // console.log("i am clicking clear button");
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.slService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
