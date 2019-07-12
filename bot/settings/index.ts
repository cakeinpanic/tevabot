import {distinctUntilChanged, map} from 'rxjs/operators';
import {firebase} from '../../database/firebase';

export interface ISettings {
    activated: boolean;
}

export const CURRENT_SETTINGS: ISettings = {
    activated: false
};

firebase.$settings
    .pipe(
        map(({activated}) => activated),
        distinctUntilChanged()
    )
    .subscribe(newStatus => {
        CURRENT_SETTINGS.activated = newStatus;
    });
