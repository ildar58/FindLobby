import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {InfoInputPage} from './info-input.page';

describe('InfoInputPage', () => {
    let component: InfoInputPage;
    let fixture: ComponentFixture<InfoInputPage>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [InfoInputPage],
                imports: [IonicModule.forRoot()],
            }).compileComponents();

            fixture = TestBed.createComponent(InfoInputPage);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
