//->StartFragment1
///////////////////////////////////////////////////////////////////////////////
// ���������������� ���������� ���������, ��� ����������� �� ������ �������
//////////////////////////////////////////////////////////////////////////////
//CardNumber ����� �����
//Phone ��������� ����� ��������
//FIO ���
//ClientPhone ����� �������� �������
//ClientBDay  ���� �������� �������
//ClientSale  ����� ����� ������� �������
//Balance ������ �����
//DiscountBon ����� ������ ��������
//DiscountGiC ����� ������ ����������� �������������
//SumSalerI ������ �������
//SumSalerS ������ ������� �� ������� �����
//NameSaler ��� �������
//CertSumm ����� ��������� ������������
//DebtSumm ����� ����� �� ���������
//Available ������ �����, ��������� � ��������

///////////////////////////////////////////////////////////////////////////////
//<-StopFragment

//->StartFragment3
function init() {
	//V.5.0 �� 12.10.2018
	ScriptVersion = 49;
	MinimalDllVersion = 2;
	//<-StopFragment
	//->StartFragment4
	frontol.addEventListener("openDocument", "afterOpenDocument", false);
	frontol.addEventListener("closeDocument", "afterCloseDocument", false);
	frontol.addEventListener("openSession", "afterOpenSession", false);
	frontol.addEventListener("closeSession", "afterCloseSession", false);
	frontol.addEventListener("closeDocument", "beforeCloseDocument", true);
	frontol.addEventListener("addCard", "BeforeAddCard", true);
	frontol.addEventListener("addCard", "AfterAddCard", false);
	frontol.addEventListener("addPayment", "beforeAddPayment", true);
	frontol.addEventListener("addPosition", "AfterAddPosition", false);
	frontol.addEventListener("changePosition", "AfterAddPosition", false);
	frontol.addEventListener("addPosition", "BeforeAddPosition", true);
	frontol.addEventListener("changePosition", "BeforeAddPosition", true);
	frontol.addEventListener("stornoPayment", "BeforeStornoPayment", true);
	frontol.addEventListener("cancelDocument", "BeforeCancelDocument", true);

	ThisInstallment=false;
	SumInstallment = 0;
	SumNoInstallment = 0;

	// ����-���������� ������������ �����������
	Bonica = new ActiveXObject("AddIn.BonicaUpdate");
	Bonica.FrontolInit(5);

	WshShell = new ActiveXObject("WScript.Shell");
	Bonica = new ActiveXObject("AddIn.Bonica");
	Bonica.FrontolInit(5);

	// ��������������� ��� �������, ���� �� ����� ��������� �������� ������� �������������
	Bonica.UpdateFrontolScript();

	if (!Bonica.SetFrontolScript(ScriptVersion, MinimalDllVersion))
		frontol.actions.showMessage("��� ������ �������� ��������� ���������� BonicaAddIn.dll �� ������ " + MinimalDllVersion + " ��� ����.", Icon.Error);
	Bonica.SaveToLog("������� �������������", 0, "��� �������");
	if (Bonica.SalerAsCashier)
		Bonica.UpdateListSellers(false);
	Bonica.SaveToLog("�������� ������ �������� �� �������", 0, "��� �������");
	Bonica.UpdateListWareGroup(true);
	Bonica.SaveToLog("�������� ������ ����� ������� �� �������", 0, "��� �������");
	Bonica.GetCertOnCash();
	Bonica.SaveToLog("��������� ������ ������������", 0, "��� �������");
	//<-StopFragment
	//->StartFragment5
}

function afterOpenSession() {
	Bonica.OpenSession(frontol.currentUser.code, frontol.sessionNumber);
}

function afterCloseSession() {
	Bonica.CloseSession(frontol.currentUser.code, frontol.sessionNumber);
}

function afterOpenDocument() {
	//<-StopFragment
	//->StartFragment6
	frontol.currentDocument.userValues.set("CardConfirm", "0");
	frontol.currentDocument.userValues.set("ThisReturn", "0");
	//	frontol.currentDocument.userValues.set("PayByInst", "0");
	SumInstallment = 0;
	SumNoInstallment = 0;
	ThisInstallment=false;
	//<-StopFragment

	//->StartFragment7
	frontol.currentDocument.userValues.set("CardNumber", " "); //����� �����
	frontol.currentDocument.userValues.set("Phone", " "); //����� ��������, ������� ���� ������
	frontol.currentDocument.userValues.set("FIO", ""); //���
	frontol.currentDocument.userValues.set("ClientPhone", ""); //����� �������� �������
	frontol.currentDocument.userValues.set("ClientBDay", ""); //���� �������� �������
	frontol.currentDocument.userValues.set("ClientSale", "0"); //����� ����� ������� �������
	frontol.currentDocument.userValues.set("Balance", "0"); //������
	frontol.currentDocument.userValues.set("Available", "0"); //�������� � ��������
	frontol.currentDocument.userValues.set("DebtSumm", "0"); //����� �����
	frontol.currentDocument.userValues.set("DiscountBon", "0"); //����� ������ ��������
	frontol.currentDocument.userValues.set("DiscountGiC", "0"); //����� ������ ����������� �������������
	frontol.currentDocument.userValues.set("DiscountGiCI", "0"); //����� ������ ����������� ������������� �����������
	frontol.currentDocument.userValues.set("SumBeforeDisc", "0"); //����� ���������� �� ������ ������������
	frontol.currentDocument.userValues.set("CertSumm", "0"); //����� ������ ����������� �������������
	frontol.currentDocument.userValues.set("AccrueBonuses", "0"); //����� ����������� ������� �� ������� ���� (�������� ������ ����� �������� ����)
	frontol.currentDocument.userValues.set("DocType", frontol.currentDocument.type.name); //��� ���������
	// ������������ ��� ������ ���������� ����� �������� ��������� ����
	//<-StopFragment


	//->StartFragment8
	if (Bonica.InetConnection()) {
		Bonica.SaveToLog("��� �������� ��������� ���� ����� � ��������", 0, "��� �������");
		//<-StopFragment
		//->StartFragment9

		//<-StopFragment
	} else {
		//->StartFragment10
		Bonica.SaveToLog("��� �������� ��������� ��� ����� � ��������", 0, "��� �������");
		frontol.currentDocument.userValues.set("FIO", "��� ����� � �������� ����������!"); //��������� �� ������ ����� � ��������
		//<-StopFragment
		//->StartFragment11
	}
	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		//<-StopFragment

		//->StartFragment12
		if (Bonica.SalerAsCashier) {
			//<-StopFragment
			//->StartFragment13
			CardB = 0;
			frontol.currentDocument.userValues.set("NameSaler", frontol.currentDocument.openUser.name); // ������ ������� �� ������� �����
			//			CardB = Bonica.GetTotalSalesSeller(frontol.currentDocument.openUser.code);
			frontol.currentDocument.userValues.set("SumSalerI", "" + Math.round(CardB * 100) / 100); //������ �������
			//			CardB = Bonica.GetTotalSalesSellerForSession(frontol.currentDocument.openUser.code, frontol.sessionNumber);
			frontol.currentDocument.userValues.set("SumSalerS", "" + Math.round(CardB * 100) / 100); // ������ ������� �� ������� �����
			//<-StopFragment
			//->StartFragment14
		}
		//<-StopFragment
		//->StartFragment15
	}

	if ((frontol.currentDocument.type.code == 2) && (frontol.currentDocument.card.count > 0)) {
		//<-StopFragment
		// � ������ �������� �� ���������, ���������� ������������ �������� �����
		for (frontol.currentDocument.card.index = 1;
			frontol.currentDocument.card.index <= frontol.currentDocument.card.count;
			frontol.currentDocument.card.index++) {
			CT = Bonica.GetCardType(frontol.currentDocument.card.value);

			if (CT == 1) {
				CardNumber = frontol.currentDocument.card.value;
				Bonica.CheckBonusCard(CardNumber); // �������� � ����������� �����

				if (Bonica.ErrorCode == 0) {
					CardB = Bonica.CardBalance(CardNumber, 0);
					if (Bonica.Alive == 0) {
						Bonica.SaveToLog("��������� ����� ���������.", 0, "��� �������");
						frontol.actions.showError("��������� ����� ���������.");
					}
					if (Bonica.ErrorCode == 0) {
						var CardNumber = Bonica.CardNumber;
						frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
						frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
						CardB = Bonica.CardBalance(CardNumber, 1);
						frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
						Bonica.GetCardParam(Bonica.CardNumber);
						frontol.currentDocument.userValues.set("FIO", "" + Bonica.Fam + " " + Bonica.Im);
						frontol.currentDocument.userValues.set("ClientPhone", "" + Bonica.Phone);
						frontol.currentDocument.userValues.set("ClientBDay", "" + Bonica.BDay);
						frontol.currentDocument.userValues.set("ClientSale", "" + Bonica.Sale);
					} else {
						Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
						frontol.actions.showError(Bonica.ErrorDescription);
					}
				} else {
					// ������ ����� ��� ���������
					frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
				}
				frontol.currentDocument.userValues.set("ThisReturn", "1");
				break;
			}

		}

	}
	Bonica.OpenDocument();
}

function beforeCloseDocument() {
	Bonica.SaveToLog("beforeCloseDocument", 0, "��� �������");

	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		var CertSale = 0;
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {
				// �������� �� ������� ������������
				if (frontol.currentDocument.position.ware.code == (+Bonica.GiftCardCode)) {
					CertSale = CertSale + 1;
				}
			}
		}

		if (CertSale != 0) {
			if (CertSale != frontol.currentDocument.position.count) {
				Bonica.SaveToLog("������ ��������� ����������� � �������� � ����� ���� !", 0, "��� �������");
				frontol.actions.showError("������ ��������� ����������� � �������� � ����� ���� !");
			}
			sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
			if (sumdsc != 0) {
				Bonica.SaveToLog("���������� ����������� ������ ���������� ��������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ���������� ��������");
			}
			sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
			if (sumdsc != 0) {
				Bonica.SaveToLog("���������� ����������� ������ ���������� ����������� �������������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ���������� ����������� �������������");
			}
			if (frontol.currentDocument.type.code != 1) {
				Bonica.SaveToLog("���������� ����������� ������ ����������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ����������");
			}
		}

		if (ThisInstallment)
		{
			// �������� �� ���������
			for (frontol.currentDocument.payment.index = 1;
				frontol.currentDocument.payment.index <= frontol.currentDocument.payment.count;
				frontol.currentDocument.payment.index++) {
				if (frontol.currentDocument.payment.type.code == Bonica.InstallmentCode) {
					SumInstallment = SumInstallment + frontol.currentDocument.payment.sumInBaseCurrency;
				} else {
					SumNoInstallment = SumNoInstallment + frontol.currentDocument.payment.sumInBaseCurrency;
				}
			}
			if (SumInstallment > 0) {
				CN = frontol.currentDocument.userValues.get("CardNumber");
				if ((CN.length > 1) && (( + frontol.currentDocument.userValues.get("CardConfirm")) == 1)) { // ����� ������� �������
					// ��������� �� ��������� ������� �������� �������
					// 5 - ������� � ������ �������
					// 6 - ������� ��� ������� ������
					// 7 - ������� �������
					if (SumNoInstallment == 0) {
						WshShell.Run(Bonica.Path + "AtolFiscalPrinterCommand.exe SetSettings 2 1 113 0 6", 2, true);
					} else {
						WshShell.Run(Bonica.Path + "AtolFiscalPrinterCommand.exe SetSettings 2 1 113 0 5", 2, true);
					}
				} else {
					frontol.actions.showError("������ ��������� ����� � ��������� ��� ���������� �������!");
				}
			}
		}
	}
	
	if (frontol.currentDocument.type.code == 23) {
		// ������ ����
		var Dt = new Date();
		var sDt = "" + Dt.getDate() + "." + (Dt.getMonth() + 1) + "." + Dt.getFullYear() + " " + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();
		Bonica.CancelInstallmentFromCheque(frontol.currentDocument.userValues.get("CardNumber"), sDt, frontol.currentDocument.totalSum, frontol.sessionNumber);
		if (Bonica.ErrorCode != 0) {
			Bonica.SaveToLog(Bonica.ErrorDescription + Bonica.ErrorCode, 0, "��� �������");
			frontol.actions.showError(Bonica.ErrorDescription);
		}
		

		// ��������� �� ��������� ������� �������� �������
		// 5 - ������� � ������ �������
		// 6 - ������� ��� ������� ������
		// 7 - ������� �������
		WshShell.Run(Bonica.Path + "AtolFiscalPrinterCommand.exe SetSettings 2 1 113 0 7", 2, true);
	}

}

function afterCloseDocument() {
	Bonica.SaveToLog("afterCloseDocument", 0, "��� �������");

	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
		var Phone = "" + frontol.currentDocument.userValues.get("Phone");

		Bonica.SaveToLog("CardNumber=" + CardNumber, 0, "��� �������");
		Bonica.SaveToLog("Phone=" + Phone, 0, "��� �������");

		SummCardB = 0;
		var Bonus = 0;
		if (frontol.currentDocument.type.code == 2)
			TextT = "������� ";
		else
			TextT = "������� ";

		var Dt = new Date();
		var sDt = "" + Dt.getDate() + "." + (Dt.getMonth() + 1) + "." + Dt.getFullYear() + " " + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();
		var sTm = "" + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();

		if (( + frontol.currentDocument.userValues.get("ThisReturn")) == 1) {
			for (frontol.currentDocument.discountDoc.index = 1;
				frontol.currentDocument.discountDoc.index <= frontol.currentDocument.discountDoc.count;
				frontol.currentDocument.discountDoc.index++) {
				if ((frontol.currentDocument.discountDoc.valueType == 0) && (frontol.currentDocument.discountDoc.type == 2) && (frontol.currentDocument.discountDoc.marketingAction.name == "������ ��������")) {
					Bonica.AccrueBonuses(CardNumber, frontol.currentDocument.discountDoc.value * Bonica.RateOfBonusesToRubles, "��� �������� ������ ��������� " + frontol.currentDocument.discountDoc.value * Bonica.RateOfBonusesToRubles + " �������.", sDt, frontol.sessionNumber, frontol.currentDocument.number)
					if (Bonica.ErrorCode != 0) {
						Bonica.SaveToLog(Bonica.ErrorDescription + Bonica.ErrorCode, 0, "��� �������");
						frontol.actions.showError(Bonica.ErrorDescription + Bonica.ErrorCode);
					} else {
						frontol.currentDocument.userValues.set("DiscountBon", "" + frontol.currentDocument.discountDoc.value); //����� ������ ��������
						Bonica.CardBalance(CardNumber);
						if (Bonica.ErrorCode == 0) {
							frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
							Bonica.CardBalance(CardNumber, 1);
							frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
						}
					}

				}
			}
		}

		var CertSale = 0;
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {
				// �������� �� ������� ������������
				if (frontol.currentDocument.position.ware.code == (+Bonica.GiftCardCode)) {
					CertSale = CertSale + 1;
				}
			}
		}

		if (CertSale != 0) {
			// ������ �����������
			Bonica.BeginSaveDocument(4, 0, sDt, 3, 4, frontol.currentDocument.closeUser.name);
			for (frontol.currentDocument.position.index = 1;
				frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
				frontol.currentDocument.position.index++) {
				if ((frontol.currentDocument.position.storno == 0) &&
					(frontol.currentDocument.position.quantity > 0)) {

					for (frontol.currentDocument.position.aspect.index = 1;
						frontol.currentDocument.position.aspect.index <= frontol.currentDocument.position.aspect.count;
						frontol.currentDocument.position.aspect.index++) {
						if (Bonica.GiftCardFloatingSum)
							Bonica.AddCertToDocument(Bonica.AscpectToCard("" + frontol.currentDocument.position.aspect.code), frontol.currentDocument.position.priceWithDiscs);
						else
							Bonica.AddCertToDocument(Bonica.AscpectToCard("" + frontol.currentDocument.position.aspect.code));
					}
				}
			}
			Bonica.EndSaveDocument(0);
			if (Bonica.ErrorCode != 0) {
				Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
				Bonica.SaveToLog("������ ! �������� ��� ������� ������������ ������ !", 0, "��� �������");
				frontol.actions.showError("������ ! �������� ��� ������� ������������ ������ !");
			}
		}

		sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
		sumdsc1 =  + frontol.currentDocument.userValues.get("DiscountGiC");
		sumrefund = sumdsc + sumdsc1;
		// ��� ��������� ��������
		sumrefund = 0;

		Bonica.SaveToLog("sumdsc=" + sumdsc, 0, "��� �������");
		Bonica.SaveToLog("sumdsc1=" + sumdsc1, 0, "��� �������");
		Bonica.SaveToLog("sumrefund=" + sumrefund, 0, "��� �������");

		Bonica.BeginSaveDocument(3, 0, sDt, frontol.sessionNumber, frontol.currentDocument.number, TextT, CardNumber, sTm, 0, 0, Phone, sumrefund);
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {

				TempText = TextT + frontol.currentDocument.position.ware.name + ".";
				if (TempText.length < 45)
					TextT = TempText;

				var GroupCode = 0;
				var GroupName = "";
				if (frontol.currentDocument.position.ware.parent.count > 0) {
					frontol.currentDocument.position.ware.parent.index = 1;
					GroupCode = frontol.currentDocument.position.ware.parent.code;
					GroupName = frontol.currentDocument.position.ware.parent.name;
				}

				var ClassifCode = "0";
				var ClassifCode1 = "0";
				var ClassifCode2 = "0";
				var ClassifCode3 = "0";
				var ClassifCode4 = "0";
				if (frontol.currentDocument.position.ware.classifier.count > 0) {
					frontol.currentDocument.position.ware.classifier.index = 1;
					ClassifCode = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 1) {
					frontol.currentDocument.position.ware.classifier.index = 2;
					ClassifCode1 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 2) {
					frontol.currentDocument.position.ware.classifier.index = 3;
					ClassifCode2 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 3) {
					frontol.currentDocument.position.ware.classifier.index = 4;
					ClassifCode3 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 4) {
					frontol.currentDocument.position.ware.classifier.index = 5;
					ClassifCode4 = frontol.currentDocument.position.ware.classifier.code;
				}

				var SalerCode;
				var SalerCard;
				var CashierCode;
				if (Bonica.SalerAsCashier) {
					SalerCode = frontol.currentDocument.closeUser.code;
					SalerCard = "";
					CashierCode = "0";
				} else {
					SalerCode = "0";
					SalerCard = frontol.currentDocument.userValues.get("I" + frontol.currentDocument.position.index);
					CashierCode = frontol.currentDocument.closeUser.code;
				}

				// ����������� �� ����
				//
				var MinPrice = 0;
				var BonusLimit = false;
				if (Bonica.AccrueBonusLimitType == 1) // ����������� ����
				{
					MinPrice = frontol.currentDocument.position.ware.minPrice;
				}

				if (Bonica.AccrueBonusLimitType == 2) // ������������ ������
				{
					MinPrice = frontol.currentDocument.position.ware.price - frontol.currentDocument.position.ware.price * frontol.currentDocument.position.ware.maxDiscount / 100;
				}
				if (Bonica.AccrueBonusLimitType == 3) // ����� ���������� �������� �����������
				{
					if ((frontol.currentDocument.position.ware.minPrice > 0) || (frontol.currentDocument.position.ware.price * frontol.currentDocument.position.ware.maxDiscount == 0))
						BonusLimit = true;
				}

				Bonica.SaveToLog("MinPrice=" + MinPrice, 0, "��� �������");
				Bonica.SaveToLog("BonusLimit=" + BonusLimit, 0, "��� �������");

				// ���� ���� ������ ������������� ��� ��������, �� ���� ������������ ��������� ������
				var TotalSum,
				Sum,
				Pay_Bonus = 0,
				Pay_Certif = 0;
				if ((sumdsc > 0) || (sumdsc1 > 0)) {
					if (( + frontol.currentDocument.userValues.get("ThisReturn")) == 1) {
						TotalSum = frontol.currentDocument.position.totalSum + sumdsc;
						Sum = frontol.currentDocument.position.sum + sumdsc;
						Pay_Bonus = sumdsc;
					} else {

						TotalSum =  + frontol.currentDocument.userValues.get("TS" + frontol.currentDocument.position.index);
						Sum =  + frontol.currentDocument.userValues.get("S" + frontol.currentDocument.position.index);
						if (sumdsc > 0) {
							Pay_Bonus = TotalSum - frontol.currentDocument.position.totalSum;
						}
						if (sumdsc1 > 0) {
							Pay_Certif = TotalSum - frontol.currentDocument.position.totalSum;
						}
					}
				} else {
					TotalSum = frontol.currentDocument.position.totalSum;
					Sum = frontol.currentDocument.position.sum;
				}

				Bonica.SaveToLog("TotalSum=" + TotalSum, 0, "��� �������");
				Bonica.SaveToLog("Sum=" + Sum, 0, "��� �������");

				var SalerSum;
				SalerSum = 0;

				if (frontol.currentDocument.type.code == 2) {
					Bonica.AddSCToDocument(SalerCode, ClassifCode, CashierCode,  - (TotalSum),
						-SalerSum, -frontol.currentDocument.position.quantity, 0, -Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, SalerCard, MinPrice, BonusLimit, Pay_Bonus, Pay_Certif,
						ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				} else {
					Bonica.AddSCToDocument(SalerCode, ClassifCode, CashierCode, TotalSum,
						SalerSum, frontol.currentDocument.position.quantity, 0, Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, SalerCard, MinPrice, BonusLimit, Pay_Bonus, Pay_Certif,
						ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				}

			}
		}
		for (frontol.currentDocument.payment.index = 1;
			frontol.currentDocument.payment.index <= frontol.currentDocument.payment.count;
			frontol.currentDocument.payment.index++) {
			Bonica.AddPayToDocument("" + frontol.currentDocument.payment.type.code, frontol.currentDocument.payment.sumInBaseCurrency);
		}
		var sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
		if (sumdsc != 0) {
			Bonica.AddPayToDocument(Bonica.BonusCardPayTypeCode, sumdsc);
		}
		var sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
		if (sumdsc != 0) {
			Bonica.AddPayToDocument(Bonica.GiftCardPayTypeCode, sumdsc);
		}
		Bonica.EndSaveDocument(1);

		frontol.currentDocument.userValues.set("AccrueBonuses", "" + Bonica.Balance);
		Bonica.SaveToLog("��������� � ���������� ���������� ����=" + Bonica.Balance, 0, "��� �������");
		Bonica.CardBalance(CardNumber);
		if (Bonica.ErrorCode == 0) {
			Bonica.SaveToLog("������ ������ �����=" + Bonica.Balance, 0, "��� �������");
			frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
			Bonica.CardBalance(CardNumber, 1);
			frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
		}

		if ((CertSale != 0) || (sumdsc1 != 0)) {
			// ����  � ���� ���� ���� �������� �� ������������, �� ����� �������� ���������� � ������������ �� �����
			Bonica.GetCertOnCash();
		}
		if (ThisInstallment)
		{
			for (frontol.currentDocument.position.index = 1;
				frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
				frontol.currentDocument.position.index++) {
					Bonica.SetWarePaymentMode(frontol.currentDocument.position.ware.code, 2, false);
				}

			WshShell.Run(Bonica.Path + "AtolFiscalPrinterCommand.exe SetSettings 2 1 113 0 4", 2, true);
		}
	}

	if ((frontol.currentDocument.type.code == 21) || (frontol.currentDocument.type.code == 22)) {
		// ����������� ������������

		var Dt = new Date();
		var sDt = "" + Dt.getDate() + "." + (Dt.getMonth() + 1) + "." + Dt.getFullYear() + " " + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();
		var sTm = "" + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();

		if (frontol.currentDocument.type.code == 21) {
			Bonica.BeginSaveDocument(4, 0, sDt, 2, 3, frontol.currentDocument.closeUser.name);
		} else {
			Bonica.BeginSaveDocument(4, 0, sDt, 3, 2, frontol.currentDocument.closeUser.name);
		}

		for (frontol.currentDocument.card.index = 1;
			frontol.currentDocument.card.index <= frontol.currentDocument.card.count;
			frontol.currentDocument.card.index++) {
			Bonica.AddCertToDocument(frontol.currentDocument.card.value);
		}

		Bonica.EndSaveDocument(0);
		if ((Bonica.ErrorCode > 0) && (BonicaErrorCode < 100)) {
			Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
			frontol.actions.showError(Bonica.ErrorDescription);
		}
		Bonica.GetCertOnCash();
	}

	if (frontol.currentDocument.type.code == 23) {
		WshShell.Run(Bonica.Path + "AtolFiscalPrinterCommand.exe SetSettings 2 1 113 0 4", 2, true);
	}
}

function AfterAddCard(Card) {}

function RegistrationByPhone() {
	var CardNumber = "";
	CN = frontol.currentDocument.userValues.get("CardNumber");
	if (CN.length > 1) {
		Bonica.SaveToLog("����������� ���� �� ����� ����� �����.", 0, "��� �������");
		frontol.actions.showError("����������� ���� �� ����� ����� �����.");
	}
	if (Bonica.RegistrationByPhone()) {
		CardB = Bonica.CardBalance(Bonica.CardNumber, 0);
		if (Bonica.Alive == 0) {
			Bonica.SaveToLog("��������� ����� ���������.", 0, "��� �������");
			frontol.actions.showError("��������� ����� ���������.");
		}
		if (Bonica.ErrorCode == 0) {
			var CardNumber = Bonica.CardNumber;
			frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
			frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
			CardB = Bonica.CardBalance(CardNumber, 1);
			frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
			Bonica.GetCardParam(Bonica.CardNumber);
			frontol.currentDocument.userValues.set("FIO", "" + Bonica.Fam + " " + Bonica.Im);
			frontol.currentDocument.userValues.set("ClientPhone", "" + Bonica.Phone);
			frontol.currentDocument.userValues.set("ClientBDay", "" + Bonica.BDay);
			frontol.currentDocument.userValues.set("ClientSale", "" + Bonica.Sale);
			frontol.currentDocument.recalculateAllDiscounts();
			frontol.currentDocument.userValues.set("CardConfirm", "1");
			var Dolg = Bonica.GetDebtClient(CardNumber, false);
			frontol.currentDocument.userValues.set("DebtSumm", "" + Dolg);
			Bonica.SaveToLog("CardNumber=" + CardNumber, 0, "��� �������");
			Bonica.SaveToLog("Bonica.Balance=" + Bonica.Balance, 0, "��� �������");
			Bonica.SaveToLog("Bonica.Fam" + Bonica.Fam + " " + Bonica.Im, 0, "��� �������");
		} else {
			Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
			frontol.actions.showError(Bonica.ErrorDescription);
		}
	}
}

function BeforeAddCard(Card) {
	var CardNumber = Card.value;

	CT = Bonica.GetCardType(CardNumber);

	if (CT == 1) {
		CN = frontol.currentDocument.userValues.get("CardNumber");
		//<-StopFragment
		//->StartFragment16
		if (CN.length > 1) {
			Bonica.SaveToLog("����������� ���� �� ����� ����� �����.", 0, "��� �������");
			frontol.actions.showError("����������� ���� �� ����� ����� �����.");
		}
		CardNumber = Bonica.CheckBonusCard(CardNumber); // �������� � ����������� �����

		//<-StopFragment
		if (Bonica.ErrorCode == 0) {
			CardB = Bonica.CardBalance(CardNumber, 0);
			if (Bonica.Alive == 0) {
				Bonica.SaveToLog("��������� ����� ���������.", 0, "��� �������");
				frontol.actions.showError("��������� ����� ���������.");
			}
			if (Bonica.ErrorCode == 0) {
				var CardNumber = Bonica.CardNumber;
				frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
				frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
				CardB = Bonica.CardBalance(CardNumber, 1);
				frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
				Bonica.GetCardParam(Bonica.CardNumber);
				frontol.currentDocument.userValues.set("FIO", "" + Bonica.Fam + " " + Bonica.Im);
				frontol.currentDocument.userValues.set("ClientPhone", "" + Bonica.Phone);
				frontol.currentDocument.userValues.set("ClientBDay", "" + Bonica.BDay);
				frontol.currentDocument.userValues.set("ClientSale", "" + Bonica.Sale);
				frontol.currentDocument.recalculateAllDiscounts();
				frontol.currentDocument.userValues.set("CardConfirm", "1");
				var Dolg = Bonica.GetDebtClient(CardNumber, false);
				if (frontol.currentDocument.type.code == 23) {
					if (frontol.currentDocument.position.count==0)
					{
						Bonica.InstallmentCancel(CardNumber, "", false);
						if (Bonica.ErrorCode == 0) {
							for (i = 0; i < Bonica.CancelInstallmentCount; i++) {
								Bonica.GetInstallmentWare(i);
								Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 0, false);
								frontol.currentDocument.addPosition("Code",Bonica.	CancelInstallmentWareCode,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,true);
								Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 2, false);
							}
						}
					}
				}
				frontol.currentDocument.userValues.set("DebtSumm", "" + Dolg);
				Bonica.SaveToLog("CardNumber=" + CardNumber, 0, "��� �������");
				Bonica.SaveToLog("Bonica.Balance=" + Bonica.Balance, 0, "��� �������");
				Bonica.SaveToLog("Bonica.Fam" + Bonica.Fam + " " + Bonica.Im, 0, "��� �������");
			} else {
				Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
				frontol.actions.showError(Bonica.ErrorDescription);
			}
		} else {
			// ������ ����� ��� ���������
			frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
		}

	} else
		// ��� �� �������� �����, ������ ��� �������� ��� ����������
	{
		if (CT == 4) {
			// ��� ����� ��������
			Bonica.GetProdParam(CardNumber);
			frontol.currentDocument.userValues.set("NameSaler", Bonica.Fam); // ������ ������� �� ������� �����
			CashierCode = Bonica.ParentNumber;
			CardB = Bonica.GetTotalSalesSeller(CashierCode);
			frontol.currentDocument.userValues.set("SumSalerI", "" + Math.round(CardB * 100) / 100); //������ �������
			CardB = Bonica.GetTotalSalesSellerForSession(CashierCode, frontol.sessionNumber);
			frontol.currentDocument.userValues.set("SumSalerS", "" + Math.round(CardB * 100) / 100); // ������ ������� �� ������� �����


			for (frontol.currentDocument.position.index = 1;
				frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
				frontol.currentDocument.position.index++) {
				SalCrd = frontol.currentDocument.userValues.get("I" + frontol.currentDocument.position.index);
				if (SalCrd.length < 2) {
					frontol.currentDocument.userValues.set("I" + frontol.currentDocument.position.index, CardNumber);
				} else {}

			}
		} else {
			if (CT == 3) {
				// ��� ���������� ����������

				Bonica.GetCertStatus(CardNumber);
				if (Bonica.ErrorCode == 0) {

					if ((frontol.currentDocument.type.code == 21) || (frontol.currentDocument.type.code == 22)) {
						if ((frontol.currentDocument.type.code == 21) && (Bonica.Alive == 2)) {
							frontol.currentDocument.userValues.set("DiscountGiC", "" + ( + frontol.currentDocument.userValues.get("DiscountGiC") + Bonica.Balance));
							frontol.currentDocument.userValues.set("CertSumm", "" + Bonica.Balance);
						} else {
							if ((frontol.currentDocument.type.code == 22) && (Bonica.Alive == 3)) {
								frontol.currentDocument.userValues.set("DiscountGiC", "" + ( + frontol.currentDocument.userValues.get("DiscountGiC") + Bonica.Balance));
								frontol.currentDocument.userValues.set("CertSumm", "" + Bonica.Balance);
							} else
								//								frontol.actions.showError("������ ���������� ���������� ��� ��������");
								ShowCert(1);
						}
					} else {
						if (Bonica.Alive == 4) {
							var CurSumPay =  + frontol.currentDocument.userValues.get("DiscountBon");
							if (CurSumPay == 0) {
								refreshCertDisc(); // ��� ��� ���� ����� ��������� ��� �� � ������ �����������
								Bonica.SetCertStatus(CardNumber, 3, frontol.currentDocument.number);
								if (Bonica.ErrorCode == 0) {
									frontol.currentDocument.userValues.set("DiscountGiC", "" + ( + frontol.currentDocument.userValues.get("DiscountGiC") + Bonica.Balance));
									frontol.currentDocument.userValues.set("CertSumm", "" + Bonica.Balance);
									refreshCertDisc();

								} else {
									Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
									frontol.actions.showError(Bonica.ErrorDescription);
								}
							} else {
								Bonica.SaveToLog("������� ������ ��������. ������ ������������� ����������.", 0, "��� �������");
								frontol.actions.showError("������� ������ ��������. ������ ������������� ����������.");
							}

						} else {
							ShowCert(1);
						}
					}
				} else {
					Bonica.SaveToLog("������ � ���������� �����������, ���������� ������� ����� ������", 0, "��� �������");
					frontol.actions.showError("������ � ���������� �����������, ���������� ������� ����� ������");
				}

			} else {
				// ���������� ����� ���� �������� �� �������

				//frontol.actions.showMessage(""+CT, Icon.Error);
				//frontol.actions.showError("����� �� ����������, ���������� ������� ����� ������");
			}
		}
	}

}

function refreshCertDisc() {

	sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
	if (sumdsc == 0) {
		// ��������� ����� �������� ������ �� ������ ��������
		// ����� ���������� ����� ������
		sumBeforeDisc = 0;
		sumAfterDisc = 0;
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {
				frontol.currentDocument.position.setSpecialPrice(frontol.currentDocument.position.ware.price, 1);
				sumBeforeDisc = sumBeforeDisc + frontol.currentDocument.position.totalSum;
				frontol.currentDocument.userValues.set("TS" + frontol.currentDocument.position.index, "" + frontol.currentDocument.position.totalSum);
				frontol.currentDocument.userValues.set("S" + frontol.currentDocument.position.index, "" + frontol.currentDocument.position.sum);
				sumAfterDisc = sumAfterDisc + frontol.currentDocument.position.ware.price * frontol.currentDocument.position.quantity;
			}
		}

		frontol.currentDocument.userValues.set("sumBeforeDisc", "" + sumBeforeDisc);
		frontol.currentDocument.userValues.set("sumAfterDisc", "" + sumAfterDisc);
	}
	sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
	if (sumdsc != 0) {
		DiscountGiCI = 0;

		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {

				sumpos = frontol.currentDocument.position.totalSum;
				if (sumpos < sumdsc) {
					frontol.currentDocument.position.setSpecialPrice(0, 1);
					sumdsc = sumdsc - sumpos;
					DiscountGiCI = DiscountGiCI + sumpos;
				} else {
					DiscountGiCI = DiscountGiCI + sumdsc;
					frontol.currentDocument.position.setSpecialPrice((sumpos - sumdsc) / frontol.currentDocument.position.quantity, 0);
					sumdsc = 0;
					break;

				}
			}

		}

		frontol.currentDocument.userValues.set("DiscountGiCI", "" + DiscountGiCI);

	}

}

function RequestDiscountFromCloud() {
	if (Bonica.AutoDiscOnCheque) {
		var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
		var Phone = "" + frontol.currentDocument.userValues.get("Phone");
		var Dt = new Date();
		var sDt = "" + Dt.getDate() + "." + (Dt.getMonth() + 1) + "." + Dt.getFullYear() + " " + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();
		var sTm = "" + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();

		Bonica.BeginSaveDocument(5, 0, sDt, frontol.sessionNumber, frontol.currentDocument.number, "", CardNumber, sTm, 0, 0, Phone);
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {

				var GroupCode = 0;
				var GroupName = "";
				if (frontol.currentDocument.position.ware.parent.count > 0) {
					frontol.currentDocument.position.ware.parent.index = 1;
					GroupCode = frontol.currentDocument.position.ware.parent.code;
					GroupName = frontol.currentDocument.position.ware.parent.name;
				}

				var ClassifCode = "0";
				var ClassifCode1 = "0";
				var ClassifCode2 = "0";
				var ClassifCode3 = "0";
				var ClassifCode4 = "0";
				if (frontol.currentDocument.position.ware.classifier.count > 0) {
					frontol.currentDocument.position.ware.classifier.index = 1;
					ClassifCode = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 1) {
					frontol.currentDocument.position.ware.classifier.index = 2;
					ClassifCode1 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 2) {
					frontol.currentDocument.position.ware.classifier.index = 3;
					ClassifCode2 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 3) {
					frontol.currentDocument.position.ware.classifier.index = 4;
					ClassifCode3 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 4) {
					frontol.currentDocument.position.ware.classifier.index = 5;
					ClassifCode4 = frontol.currentDocument.position.ware.classifier.code;
				}

				// ����������� �� ����
				//
				var MinPrice = 0;
				if (Bonica.AccrueBonusLimitType == 1) // ����������� ����
				{
					MinPrice = frontol.currentDocument.position.ware.minPrice;
				}

				if (Bonica.AccrueBonusLimitType == 2) // ������������ ������
				{
					MinPrice = frontol.currentDocument.position.ware.price - frontol.currentDocument.position.ware.price * frontol.currentDocument.position.ware.maxDiscount / 100;
				}

				TotalSum = frontol.currentDocument.position.totalSum;
				Sum = frontol.currentDocument.position.sum;

				Bonica.SaveToLog("MinPrice=" + MinPrice, 0, "��� �������");

				if (frontol.currentDocument.type.code == 2) {
					Bonica.AddCLToDocument(frontol.currentDocument.position.id, ClassifCode, -frontol.currentDocument.position.quantity, 0, -Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, MinPrice, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				} else {
					Bonica.AddCLToDocument(frontol.currentDocument.position.id, ClassifCode, frontol.currentDocument.position.quantity, 0, Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, MinPrice, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				}

			}
		}
		Bonica.EndSaveDocument(1);
	}
}

function AfterAddPosition(Position) {
	if (Bonica.GiftCardFloatingSum) {
		if (Position.ware.code == (+Bonica.GiftCardCode)) {
			var CertNominal = "";
			var CertNominalV = 0;
			while (CertNominalV <= 0) {
				CertNominal = frontol.actions.inputString("������� ����� �����������", "", 10, 0);
				if ((CertNominal == null) || (CertNominal == "")) {}
				else {
					CertNominal = CertNominal.replace(",", ".");
					if (isNaN(CertNominal)) {}
					else {
						CertNominalV = Number(CertNominal);
						if (CertNominalV > 0) {
							if ((CertNominalV >= Bonica.GiftCardFloatingSumMin) && (CertNominalV <= Bonica.GiftCardFloatingSumMax)) {}
							else
								CertNominalV = 0;
						}
					}
				}
			}
			Position.setSpecialPrice(CertNominalV, 1);
		} // ��� ����������
	}
	RequestDiscountFromCloud();
	frontol.currentDocument.recalculateAllDiscounts();

	var GroupCode = 0;
	var GroupName = "";
	if (Position.ware.parent.count > 0) {
		Position.ware.parent.index = 1;
		GroupCode = Position.ware.parent.code;
		GroupName = Position.ware.parent.name;
	}

	var ClassifCode = "0";
	var ClassifCode1 = "0";
	var ClassifCode2 = "0";
	var ClassifCode3 = "0";
	var ClassifCode4 = "0";
	if (Position.ware.classifier.count > 0) {
		Position.ware.classifier.index = 1;
		ClassifCode = Position.ware.classifier.code;
	}
	if (Position.ware.classifier.count > 1) {
		Position.ware.classifier.index = 2;
		ClassifCode1 = Position.ware.classifier.code;
	}
	if (Position.ware.classifier.count > 2) {
		Position.ware.classifier.index = 3;
		ClassifCode2 = Position.ware.classifier.code;
	}
	if (Position.ware.classifier.count > 3) {
		Position.ware.classifier.index = 4;
		ClassifCode3 = Position.ware.classifier.code;
	}
	if (Position.ware.classifier.count > 4) {
		Position.ware.classifier.index = 5;
		ClassifCode4 = Position.ware.classifier.code;
	}

	var SalerCode;
	var SalerCard;
	var CashierCode;
	if (Bonica.SalerAsCashier) {
		SalerCode = frontol.currentDocument.closeUser.code;
		SalerCard = "";
		CashierCode = "0";
	} else {
		SalerCode = "0";
		SalerCard = frontol.currentDocument.userValues.get("I" + Position.index);
		CashierCode = frontol.currentDocument.closeUser.code;
	}

	// ����������� �� ����
	//
	var MinPrice = 0;
	var BonusLimit = false;
	if (Bonica.AccrueBonusLimitType == 1) // ����������� ����
	{
		MinPrice = Position.ware.minPrice;
	}

	if (Bonica.AccrueBonusLimitType == 2) // ������������ ������
	{
		MinPrice = Position.ware.price - Position.ware.price * Position.ware.maxDiscount / 100;
	}
	if (Bonica.AccrueBonusLimitType == 3) // ����� ���������� �������� �����������
	{
		if ((Position.ware.minPrice > 0) || (Position.ware.price * Position.ware.maxDiscount == 0))
			BonusLimit = true;
	}

	if (Position.storno == 0) {
		Bonica.AddPosition(Position.ware.code, Position.ware.name, Position.quantity, Position.sum, Position.totalSum, ClassifCode, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4, SalerCode, SalerCard, CashierCode, GroupCode, GroupName, MinPrice, BonusLimit);
	} else {
		Bonica.StornoPosition(Position.ware.code, Position.ware.name, StornoQuantity, StornoSum, StornoTotalSum, ClassifCode, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4, SalerCode, SalerCard, CashierCode, GroupCode, GroupName, MinPrice, BonusLimit);
	}
}

function BeforeAddPosition(Position) {
	var sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
	StornoQuantity = Position.quantity;
	StornoSum = Position.sum;
	StornoTotalSum = Position.totalSum;
	Bonica.SaveToLog("BeforeAddPosition", 0, "��� �������");

	if (sumdsc != 0) {
		Bonica.SaveToLog("��������� ����������.������� ������� ��������.", 0, "��� �������");
		frontol.actions.showError("��������� ����������.������� ������� ��������.");
	}
	sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
	if (sumdsc != 0) {
		Bonica.SaveToLog("��������� ����������.������� ������� ���������� ������������.", 0, "��� �������");
		frontol.actions.showError("��������� ����������.������� ������� ���������� ������������.");
	}

	// ���� ��� ���������� ����������
	if (Position.ware.code == (+Bonica.GiftCardCode)) {
		if ((frontol.currentDocument.type.code == 1)) {
			if (Position.aspect.count > 0) {
				//�������� �� ����������� �������
				for (Position.aspect.index = 1;
					Position.aspect.index <= Position.aspect.count;
					Position.aspect.index++) {
					Bonica.SaveToLog("����� ����� ����������� �� ���� ������� " + Position.aspect.code, 0, "��� �������");
					CertNumber = Bonica.AscpectToCard("" + Position.aspect.code);
					if (CertNumber.length > 0) {
						Bonica.GetCertStatus2(CertNumber);
						if (Bonica.ErrorCode == 0) {
							if (Bonica.Alive == 3) {
								//						frontol.currentDocument.userValues.set("DiscountGiC", "" + ( + frontol.currentDocument.userValues.get("DiscountGiC") + Bonica.Balance));
								frontol.currentDocument.userValues.set("CertSumm", "" + Bonica.Balance);
							} else {
								Bonica.SaveToLog("������ ���������� ���������� ��� �������", 0, "��� �������");
								frontol.actions.showError("������ ���������� ���������� ��� �������");
							}
						} else {
							Bonica.SaveToLog("���������� ��������� ������ ����������� ����������. �������� ����������� ����������� � ��������. ���������� ��������� �������.", 0, "��� �������");
							frontol.actions.showError("���������� ��������� ������ ����������� ����������. �������� ����������� ����������� � ��������. ���������� ��������� �������.");
						}
					} else {
						Bonica.SaveToLog("���������� �� �������� �� ����� �����!", 0, "��� �������");
						frontol.actions.showError("���������� �� �������� �� ����� �����!");
					}

				} // ������� ��������

			} else {
				Bonica.SaveToLog("���������� �� ������, ��������� �������!", 0, "��� �������");
				frontol.actions.showError("���������� �� ������, ��������� �������!");
				Bonica.GetCertOnCash();
			}

		} else {
			Bonica.SaveToLog("���������� ���������� ����� ������������ ������ � ��������� �������.", 0, "��� �������");
			frontol.actions.showError("���������� ���������� ����� ������������ ������ � ��������� �������.");
		}
	} // ��� ����������

	if (ThisInstallment)
	{
		if (Bonica.GetWarePaymentMode(Position.ware.code)==0)
		{
			Bonica.SetWarePaymentMode(Position.ware.code, 2, false);
		}
		else
		{
			Bonica.SetWarePaymentMode(Position.ware.code, 0, false);
			frontol.actions.showError("���������� ��������� ���������� ������ � ���.");
		}
	}
}

function DiscountBon() {
	var sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		Bonica.SaveToLog("������� �������� ����� ������ ��������=" + sumdsc, 0, "��� �������");
		return sumdsc;
	} else {
		Bonica.SaveToLog("������� �������� ����� ������ ��������=0", 0, "��� �������");
		return 0;
	}
}

function DiscountPosition(Position) {
	var res = Bonica.GetDiscForPosition(Position.id, Position.ware.code);
	if (res == 0)
		frontol.actions.cancel();
	return res;
}

function DiscountGiC() {
	var sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
	if ((frontol.currentDocument.type.code == 1))
		return sumdsc;
	else
		return 0;
}

function BeforeStornoPayment(Payment) {}

function beforeAddPayment(Payment) {
	var sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
	var sumdsc1 = 0;
	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {

		var CertSale = 0;
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {
				// �������� �� ������� ������������
				if (frontol.currentDocument.position.ware.code == (+Bonica.GiftCardCode)) {
					CertSale = CertSale + 1;
				}
			}
		}

		if (CertSale != 0) {
			if (CertSale != frontol.currentDocument.position.count) {
				Bonica.SaveToLog("������ ��������� ����������� � �������� � ����� ���� !", 0, "��� �������");
				frontol.actions.showError("������ ��������� ����������� � �������� � ����� ���� !");
			}
			sumdsc =  + frontol.currentDocument.userValues.get("DiscountBon");
			if (sumdsc != 0) {
				Bonica.SaveToLog("���������� ����������� ������ ���������� ��������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ���������� ��������");
			}
			sumdsc =  + frontol.currentDocument.userValues.get("DiscountGiC");
			if (sumdsc != 0) {
				Bonica.SaveToLog("���������� ����������� ������ ���������� ����������� �������������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ���������� ����������� �������������");
			}
			if (frontol.currentDocument.type.code != 1) {
				Bonica.SaveToLog("���������� ����������� ������ ����������", 0, "��� �������");
				frontol.actions.showError("���������� ����������� ������ ����������");
			}
		}

		if (sumdsc != 0) {

			for (frontol.currentDocument.discountDoc.index = 1;
				frontol.currentDocument.discountDoc.index <= frontol.currentDocument.discountDoc.count;
				frontol.currentDocument.discountDoc.index++) {
				if ((frontol.currentDocument.discountDoc.valueType == 0) && (frontol.currentDocument.discountDoc.type == 2) && (frontol.currentDocument.discountDoc.marketingAction.name == "������ ��������")) {
					sumdsc1 = sumdsc1 + frontol.currentDocument.discountDoc.value;
				}
			}
			if (sumdsc != sumdsc1) {
				Bonica.SaveToLog("����������� ����� ��������� ������ ������ =" + sumdsc + ", � �������� ������ =" + sumdsc1, 0, "��� �������");
				frontol.actions.showError("����� ����������, ���������� ������� ����� ������ �������� = " + sumdsc1 + "\n�������� ������� � ����������� �����������.");
			}

		}
		if (Payment.type.code == Bonica.InstallmentCode) {
			if (!ThisInstallment) frontol.actions.showError("����������� ������ � ���� ���������");
			if (frontol.currentDocument.type.code != 2)
			{
				var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
				Bonica.InstallmentContract(CardNumber, Payment.sumInBaseCurrency, frontol.currentDocument.number);
				if (Bonica.ErrorCode != 0) {
					frontol.actions.showError(Bonica.ErrorDescription);
				}
			}
		}
	}
	//	Bonica.AddPayment(Payment.type.�ode, Payment.type.name, Payment.sumInBaseCurrency);

}

function BeforeCancelDocument() {

	Bonica.SaveToLog("������� �������� ��������", 0, "��� �������");

	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		var CurSumPay =  + frontol.currentDocument.userValues.get("DiscountGiC");
		if (CurSumPay != 0) {
			// �������� ��� ���������� �����������
			for (frontol.currentDocument.card.index = 1;
				frontol.currentDocument.card.index <= frontol.currentDocument.card.count;
				frontol.currentDocument.card.index++) {
				Bonica.GetCertStatus(frontol.currentDocument.card.value);
				if (Bonica.ErrorCode == 0) {
					Bonica.SetCertStatus(frontol.currentDocument.card.value, 4, frontol.currentDocument.number);
					if (Bonica.ErrorCode != 0) {
						Bonica.SaveToLog(Bonica.ErrorDescription, 0, "��� �������");
						frontol.actions.showError(Bonica.ErrorDescription);
					}
				}

			}
		}

		CurSumPay =  + frontol.currentDocument.userValues.get("DiscountBon");
		if (CurSumPay != 0) {
			Bonica.CancelPayList();
			frontol.currentDocument.userValues.set("DiscountBon", "" + Bonica.PayCancelSumm); //����� ������ ��������
			if (Bonica.PayCancelSumm != 0)
				frontol.actions.showError("�� ������� ������������ ������ ��������!");
		}

		var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
		var Phone = "" + frontol.currentDocument.userValues.get("Phone");
		var Dt = new Date();
		var sDt = "" + Dt.getDate() + "." + (Dt.getMonth() + 1) + "." + Dt.getFullYear() + " " + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();
		var sTm = "" + Dt.getHours() + ":" + Dt.getMinutes() + ":" + Dt.getSeconds();

		Bonica.BeginSaveDocument(6, 0, sDt, frontol.sessionNumber, frontol.currentDocument.number, "", CardNumber, sTm, 0, 0, Phone);
		for (frontol.currentDocument.position.index = 1;
			frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
			frontol.currentDocument.position.index++) {
			if (ThisInstallment)
			{
				Bonica.SetWarePaymentMode(frontol.currentDocument.position.ware.code, 2, false);
			}
			if ((frontol.currentDocument.position.storno == 0) &&
				(frontol.currentDocument.position.quantity > 0)) {

				var GroupCode = 0;
				var GroupName = "";
				if (frontol.currentDocument.position.ware.parent.count > 0) {
					frontol.currentDocument.position.ware.parent.index = 1;
					GroupCode = frontol.currentDocument.position.ware.parent.code;
					GroupName = frontol.currentDocument.position.ware.parent.name;
				}

				var ClassifCode = "0";
				var ClassifCode1 = "0";
				var ClassifCode2 = "0";
				var ClassifCode3 = "0";
				var ClassifCode4 = "0";
				if (frontol.currentDocument.position.ware.classifier.count > 0) {
					frontol.currentDocument.position.ware.classifier.index = 1;
					ClassifCode = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 1) {
					frontol.currentDocument.position.ware.classifier.index = 2;
					ClassifCode1 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 2) {
					frontol.currentDocument.position.ware.classifier.index = 3;
					ClassifCode2 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 3) {
					frontol.currentDocument.position.ware.classifier.index = 4;
					ClassifCode3 = frontol.currentDocument.position.ware.classifier.code;
				}
				if (frontol.currentDocument.position.ware.classifier.count > 4) {
					frontol.currentDocument.position.ware.classifier.index = 5;
					ClassifCode4 = frontol.currentDocument.position.ware.classifier.code;
				}

				// ����������� �� ����
				//
				var MinPrice = 0;
				if (Bonica.AccrueBonusLimitType == 1) // ����������� ����
				{
					MinPrice = frontol.currentDocument.position.ware.minPrice;
				}

				if (Bonica.AccrueBonusLimitType == 2) // ������������ ������
				{
					MinPrice = frontol.currentDocument.position.ware.price - frontol.currentDocument.position.ware.price * frontol.currentDocument.position.ware.maxDiscount / 100;
				}

				TotalSum = frontol.currentDocument.position.totalSum;
				Sum = frontol.currentDocument.position.sum;

				Bonica.SaveToLog("MinPrice=" + MinPrice, 0, "��� �������");

				if (frontol.currentDocument.type.code == 2) {
					Bonica.AddCLToDocument(frontol.currentDocument.position.id, ClassifCode, -frontol.currentDocument.position.quantity, 0, -Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, MinPrice, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				} else {
					Bonica.AddCLToDocument(frontol.currentDocument.position.id, ClassifCode, frontol.currentDocument.position.quantity, 0, Sum,
						frontol.currentDocument.position.ware.code, frontol.currentDocument.position.ware.name,
						GroupCode, GroupName, MinPrice, ClassifCode1, ClassifCode2, ClassifCode3, ClassifCode4);
				}

			}
		}
		Bonica.EndSaveDocument(1);
	}
}

function PrintCertOnCash() {
	Bonica.PrintCertOnCash();
}

function PrintPinCode() {
	var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
	Bonica.PrintPinCode(CardNumber);
}

function ShowCert(CMode) {
	var State = "";
	if (Bonica.Alive == 1)
		State = "�� �������";
	else {
		if (Bonica.Alive == 2)
			State = "�� �� �����";
		else {
			if (Bonica.Alive == 3)
				State = "�� �����";
			else {
				if (Bonica.Alive == 4)
					State = "� ����������";
			}
		}
	}
	if (CMode == 1) {
		Bonica.SaveToLog("������ !" + "����� " + Bonica.CardNumber + "������ " + State, 0, "��� �������");
		frontol.actions.showError("������ !" + "\n����� " + Bonica.CardNumber + "\n������ " + State);
	} else {
		Bonica.SaveToLog("������ !" + "����� " + Bonica.CardNumber + "������ " + State, 0, "��� �������");
		frontol.actions.showMessage("������ !" + "\n����� " + Bonica.CardNumber + "\n������ " + State);
	}
}

function CheckOpenDocument() {
	if (frontol.currentDocument == null) {
		Bonica.SaveToLog("������. ��� �� ������. �������� ����� � ��� � ���������.", 0, "��� �������");
		frontol.actions.showError("������. ��� �� ������. �������� ����� � ��� � ���������.");
	}
}

function CheckPhoneNumber() {
	if (( + frontol.currentDocument.userValues.get("CardConfirm")) == 0) { // ������� ����� �� ������������
		var Phone = "" + frontol.currentDocument.userValues.get("Phone");
		if (Phone.length == 10) {
			if (Bonica.CheckPhoneNumber(Phone))
				frontol.currentDocument.userValues.set("CardConfirm", "1");
		} else
			frontol.actions.showError("������. ����� �������� �� ������.");
	}
}

function InputPhone() {
	CheckOpenDocument();
	var Phone = frontol.actions.inputString("������ ����� ��������, ������� � 9:", "", 10, 0);
	if (Phone == null)
		Phone = "";
	if (Phone.length == 10) {
		Bonica.CardBalanceByPhone(Phone);
		if (Bonica.ErrorCode == 0) {
			var CardNumber = Bonica.CardNumber;
			frontol.currentDocument.userValues.set("CardNumber", "" + CardNumber);
			frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
			Bonica.CardBalance(CardNumber, 1);
			frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
			Bonica.GetCardParam(Bonica.CardNumber);
			frontol.currentDocument.userValues.set("FIO", "" + Bonica.Fam + " " + Bonica.Im);
			frontol.currentDocument.userValues.set("ClientPhone", "" + Bonica.Phone);
			frontol.currentDocument.userValues.set("ClientBDay", "" + Bonica.BDay);
			frontol.currentDocument.userValues.set("ClientSale", "" + Bonica.Sale);
			frontol.currentDocument.recalculateAllDiscounts();
			frontol.currentDocument.userValues.set("CardConfirm", "0");
			if (frontol.currentDocument.type.code == 23) {
				if (frontol.currentDocument.position.count==0)
				{
					Bonica.InstallmentCancel(CardNumber, "", false);
					if (Bonica.ErrorCode == 0) {
						for (i = 0; i < Bonica.CancelInstallmentCount; i++) {
							Bonica.GetInstallmentWare(i);
							Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 0, false);
							frontol.currentDocument.addPosition("Code",Bonica.CancelInstallmentWareCode,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,true);
							Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 2, false);
						}
					}
				}
			}
		} else {
			if (Bonica.ErrorCode > 99) {
				// ���� ��� ���������, �� ������ ���������� ����� ��������


			} else {
				Phone = "";
				frontol.actions.showMessage(Bonica.ErrorDescription, Icon.Error);
			}
		}
	} else {
		Phone = "";
		frontol.actions.showMessage("�������� ����� ��������", Icon.Error);
	}
	frontol.currentDocument.userValues.set("Phone", Phone);
}

function InstallmentMode()
{
	if (frontol.currentDocument == null) frontol.actions.showError("������� �������� ����� ������� !", Icon.Error);

	if ((frontol.currentDocument.type.code == 1) || (frontol.currentDocument.type.code == 2)) {
		if (frontol.currentDocument.quantityPositions == 0)
		{
			if (ThisInstallment)
			{
				frontol.currentDocument.userValues.set("DocType", frontol.currentDocument.type.name); //��� ���������
				ThisInstallment=false;	
			}
			else
			{
				if (frontol.currentDocument.type.code == 2)
				{
					frontol.currentDocument.userValues.set("DocType", "������� ���������"); //��� ���������
					var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
					Bonica.InstallmentCancel(CardNumber, "", true);
					if (Bonica.ErrorCode == 0) {
						for (i = 0; i < Bonica.CancelInstallmentCount; i++) {
							Bonica.GetInstallmentWare(i);
							Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 0, false);
							frontol.currentDocument.addPosition("Code",Bonica.	CancelInstallmentWareCode,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareCount,Bonica.CancelInstallmentWareSumm/Bonica.CancelInstallmentWareCount,true);
							Bonica.SetWarePaymentMode(Bonica.CancelInstallmentWareCode, 2, false);
						}
						frontol.currentDocument.addPayment(Bonica.InstallmentCode,Bonica.CancelInstallmentSumm);
					}
				}
				else
				{
					frontol.currentDocument.userValues.set("DocType", "���������"); //��� ���������
				}
				ThisInstallment=true;	
			}
		}
		else
		{
			frontol.actions.showMessage("������� ������� ��� ������� �� ���� !", Icon.Error);
		}
	}
}

function InputPay() {
	CheckOpenDocument();
	Bonica.SaveToLog("������ ����� ������ ��������", 0, "��� �������");
	Bonica.SaveToLog("frontol.currentDocument.totalSum=" + frontol.currentDocument.totalSum, 0, "��� �������");
	refreshCertDisc(); // ��� ��� ���� ����� ��������� ��� �� � ������ �����������
	Bonica.SaveToLog("frontol.currentDocument.totalSum=" + frontol.currentDocument.totalSum, 0, "��� �������");
	var CurSumPay =  + frontol.currentDocument.userValues.get("DiscountGiC");
	if (( + frontol.currentDocument.userValues.get("ThisReturn")) == 0) { // ��� �� ������� ���� �� ��������� ������� ���������
		if (CurSumPay == 0) { // ������, ���� ��� ������ �������������

			if ((Bonica.ConfirmCard) && (( + frontol.currentDocument.userValues.get("CardConfirm")) != 1)) { // ������� ����� �� ������������
				var Phone = "" + frontol.currentDocument.userValues.get("Phone");
				if (Phone.length == 10) {
					if (Bonica.CheckPhoneNumber(Phone))
						frontol.currentDocument.userValues.set("CardConfirm", "1");
					else {
						Bonica.SaveToLog("��� ������ �������� ���������� ����������� ������� �������� �����.", 0, "��� �������");
						frontol.actions.showError("��� ������ �������� ���������� ����������� ������� �������� �����.");
					}
				} else {
					Bonica.SaveToLog("������. ����� �������� �� ������.", 0, "��� �������");
					frontol.actions.showError("������. ����� �������� �� ������.");
				}
			}
			var CardNumber = frontol.currentDocument.userValues.get("CardNumber");
			// ���������� ����� ��������� � �������������
			sumStop = 0;
			sumDoc = 0;
			for (frontol.currentDocument.position.index = 1;
				frontol.currentDocument.position.index <= frontol.currentDocument.position.count;
				frontol.currentDocument.position.index++) {
				if ((frontol.currentDocument.position.storno == 0) &&
					(frontol.currentDocument.position.quantity > 0)) {
					sum1 = frontol.currentDocument.position.ware.minPrice * frontol.currentDocument.position.quantity; // ����������� �� ����������� ����
					sum2 = frontol.currentDocument.position.sum - frontol.currentDocument.position.sum * frontol.currentDocument.position.ware.maxDiscount / 100; //����������� �� ������������ ������
					sumDoc = sumDoc + frontol.currentDocument.position.totalSum;
					if (sum1 > sum2)
						sumStop = sumStop + sum1;
					else
						sumStop = sumStop + sum2;
				}
			}
			Bonica.InputPayList(frontol.currentDocument.number, CardNumber, sumDoc, sumDoc - sumStop, (frontol.currentDocument.type.code == 2), frontol.sessionNumber);
			frontol.currentDocument.userValues.set("DiscountBon", "" + Bonica.PayCancelSumm); //����� ������ ��������
			Bonica.CardBalance(CardNumber);
			if (Bonica.ErrorCode == 0) {
				frontol.currentDocument.userValues.set("Balance", "" + Bonica.Balance);
				Bonica.CardBalance(CardNumber, 1);
				frontol.currentDocument.userValues.set("Available", "" + Bonica.Balance);
			}
			frontol.currentDocument.recalculateAllDiscounts();
		} else {
			Bonica.SaveToLog("��� ������ ������������� ������ �������� �� ��������.", 0, "��� �������");
			frontol.actions.showError("��� ������ ������������� ������ �������� �� ��������.");
		}
	} else {
		Bonica.SaveToLog("��� �������� �� ��������� ����� ������ ����������������� �������������", 0, "��� �������");
		frontol.actions.showError("��� �������� �� ��������� ����� ������ ����������������� �������������");
	}
}
