import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AgePipe } from '../age.pipe';
import { AreaPipe } from '../area.pipe';
import { GenderPipe } from '../gender.pipe';
import { CareerPipe } from '../career.pipe';
import { DayPipe } from '../day.pipe';
import { FrequencyPipe } from '../frequency.pipe';
import { LevelPipe } from '../level.pipe';
import { ReasonPipe } from '../reason.pipe';
import { BloodPipe } from '../blood.pipe';
import { BodyPipe } from '../body.pipe';
import { CharacterPipe } from '../character.pipe';
import { DrinkingPipe } from '../drinking.pipe';
import { HeightPipe } from '../height.pipe';
import { ReligionPipe } from '../religion.pipe';
import { SmokingPipe } from '../smoking.pipe';
import { WeightPipe } from '../weight.pipe';
import { InviteOptionPipe } from '../invite-option.pipe';
import { Nl2brPipe } from '../nl2br.pipe';
import { TimestampPipe } from '../timestamp.pipe';

@NgModule({
  declarations: [
  	AgePipe,
  	AreaPipe,
  	GenderPipe,
  	CareerPipe,
  	DayPipe,
  	FrequencyPipe,
  	LevelPipe,
  	ReasonPipe,
  	BloodPipe,
  	BodyPipe,
  	CharacterPipe,
  	DrinkingPipe,
  	HeightPipe,
  	ReligionPipe,
  	SmokingPipe,
  	WeightPipe,
		InviteOptionPipe,
		Nl2brPipe,
		TimestampPipe
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
  	AgePipe,
  	AreaPipe,
  	GenderPipe,
  	CareerPipe,
  	DayPipe,
  	FrequencyPipe,
  	LevelPipe,
  	ReasonPipe,
  	BloodPipe,
  	BodyPipe,
  	CharacterPipe,
  	DrinkingPipe,
  	HeightPipe,
  	ReligionPipe,
  	SmokingPipe,
  	WeightPipe,
		InviteOptionPipe,
		Nl2brPipe,
		TimestampPipe
  ]
})
export class PipesModule { }
