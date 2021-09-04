import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PhoneInputPage} from './phone-input.page';

describe('PhoneInputPage', () => {
    let component: PhoneInputPage;
    let fixture: ComponentFixture<PhoneInputPage>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [PhoneInputPage],
                imports: [IonicModule.forRoot()],
            }).compileComponents();

            fixture = TestBed.createComponent(PhoneInputPage);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
