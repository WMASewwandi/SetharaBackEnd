import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  pdf,
} from "@react-pdf/renderer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Card, Grid, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import BASE_URL from "Base/api";
import DocSubType from "pages/inquiry/Types/docSubType";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { Font } from "@react-pdf/renderer";

// Font.register({
//   family: "CustomFont",
//   src: "@/public/fonts/times/timesnewroman.ttf",
// });

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    top: 0,
    position: "absolute",
    zIndex: -1,
  },
  sign: {
    width: "150px",
    height: "50px",
    bottom: "95px",
    position: "absolute",
    zIndex: -1,
    left: "35px",
  },
  section: {
    margin: 10,
    // padding: 10,
    flexGrow: 1,
    border: "1px solid black",
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px",
    marginTop: "135px",
    marginLeft: "220px",
    textDecoration: "underline",
  },
  date: {
    fontSize: "12px",
    marginBottom: "20px",
    marginTop: "10px",
    marginLeft: "40px",
  },
  inquiryCode: {
    position: "absolute",
    fontSize: "12px",
    top: "177px",
    right: "100px",
  },
  addDesi: {
    fontSize: "12px",
    marginBottom: "5px",
    marginLeft: "40px",
  },
  add: {
    fontSize: "12px",
    marginBottom: "5px",
    marginLeft: "40px",
  },
  tablecell: {
    fontSize: "12px",
    border: "1px solid black",
    padding: "5px",
  },
  tablecell2: {
    fontSize: "12px",
    border: "1px solid black",
    padding: "5px",
    borderTop: "none",
  },
  contact: {
    fontSize: "12px",
    border: "1px solid gray",
    padding: "5px",
  },
  heading: {
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "15px",
    marginBottom: "15px",
    marginLeft: "40px",
  },
  points: {
    fontSize: "12px",
    marginLeft: "20px",
    marginBottom: "8px",
    marginLeft: "40px",
    marginRight: "85px",
    // fontFamily: "CustomFont",
  },
  highlight: {
    color: "red",
  },
});

export default function ViewQuotation({
  quotDetails,
  selectedOption,
  selectedDate,
  percentage,
  startDate,
  validDate,
  termDay,
  handoverDate,
  url,
}) {
  const [open, setOpen] = useState(false);
  const [fabs, setFabs] = useState([]);
  const [doc, setDoc] = useState();
  const [shareURL, setShareURL] = useState(url);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openShare, setOpenShare] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [whatsappNo, setWhatsappNo] = useState("");
  const [message, setMessage] = useState("");
  const handleShareClose = () => setOpenShare(false);

  const handleCardClick = (id) => {
    setSelectedCard(id);
  };
  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Customer/GetCustomerDetailByID?customerId=${quotDetails.customerDetils.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const responseData = await response.json();
      const customerData = responseData.result.result[0];
      let oldNumber = customerData.customerContactDetails[0].contactNo;
      let newNumber = "+94" + oldNumber.slice(1);
      setWhatsappNo(newNumber);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchFabricValueList = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetAllInquiryFabric?InquiryID=${quotDetails.inquiryID}&OptionId=${quotDetails.optionId}&WindowType=${quotDetails.windowType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Value List");
      }

      const data = await response.json();
      setFabs(data.result);
    } catch (error) {
      console.error("Error fetching Value List:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/AWS/GetAllDocumentsByOption?InquiryID=${quotDetails.inquiryID}&OptionId=${quotDetails.optionId}&WindowType=${quotDetails.windowType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }
      const data = await response.json();
      const filteredData = data.result.filter(
        (item) => item.documentSubContentType !== 5
      );
      const firstResult = filteredData.length > 0 ? filteredData[0] : null;
      if (firstResult) {
        setDoc(firstResult.documentSubContentType);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
    fetchDocuments();
    fetchFabricValueList();
  }, []);

  const handleShareNow = async () => {
    const url = shareURL;
    if (!url || typeof url !== "string") {
      console.log("Invalid URL");
    }

    if (selectedCard == 0) {
      const phoneNumber = whatsappNo;
      try {
        const apiUrl = `https://api.textmebot.com/send.php?recipient=${phoneNumber}&apikey=781LrdZkpdLh&document=${encodeURIComponent(
          url
        )}`;
        const response = await fetch(apiUrl, {
          method: "GET", 
          mode: 'no-cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        // console.error("Error sending document:", error);
      }
      toast.success("Document Sent Successfully");
      setOpenShare(false);
      setOpen(false);  
      console.clear();   
      // const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      //   message
      // )}`;
      // const a = document.createElement("a");
      // a.href = whatsappURL;
      // a.target = "_blank";
      // a.style.display = "none";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    } else if (selectedCard == 1) {
      const emailSubject = "Check out this link";
      const emailBody =
        "Hi there,\n\nI wanted to share this link with you:\n" + url;
      const mailtoLink =
        "mailto:?subject=" +
        encodeURIComponent(emailSubject) +
        "&body=" +
        encodeURIComponent(emailBody);
      const a = document.createElement("a");
      a.href = mailtoLink;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const messengerLink =
        "https://www.facebook.com/dialog/share?app_id=YourAppID&href=" +
        encodeURIComponent(url);
      const a = document.createElement("a");
      a.href = messengerLink;
      a.target = "_blank";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const window =
    quotDetails.windowType == 1
      ? "T-Shirt"
      : quotDetails.windowType == 2
      ? "Shirt"
      : quotDetails.windowType == 3
      ? "Cap"
      : quotDetails.windowType == 4
      ? "Visor"
      : quotDetails.windowType == 5
      ? "Hat"
      : quotDetails.windowType == 6
      ? "Bag"
      : quotDetails.windowType == 7
      ? "Bottom"
      : "Short";

  const MyDocument = (
    <Document>
      <Page size="A4" fileName={quotDetails.inqCode} style={styles.page}>
        <View style={styles.section}>
          <Image
            style={styles.backgroundImage}
            src="/images/quotation/abc.jpg"
          />
          <Text style={styles.title}>Quotation</Text>
          <Text style={styles.date}>{selectedDate}</Text>
          <Text style={styles.inquiryCode}>{quotDetails.inqCode}</Text>
          <Text style={styles.add}>
            {quotDetails.customerDetils ? (
              <>
                {quotDetails.customerDetils.title}{" "}
                {quotDetails.customerDetils.firstName}{" "}
                {quotDetails.customerDetils.lastName},
              </>
            ) : (
              "Invalid Customer"
            )}
          </Text>
          <Text style={styles.addDesi}>
            {quotDetails.customerDetils ? (
              <>{quotDetails.customerDetils.designation},</>
            ) : (
              ""
            )}
          </Text>
          <Text style={styles.add}>
            {quotDetails.customerDetils ? (
              <>{quotDetails.customerDetils.company},</>
            ) : (
              ""
            )}
          </Text>
          <Text style={styles.add}>
            {quotDetails.customerDetils ? (
              <>
                {quotDetails.customerDetils.addressLine1}
                {quotDetails.customerDetils.addressLine2 &&
                  `, ${quotDetails.customerDetils.addressLine2}`}
                {quotDetails.customerDetils.addressLine3 &&
                  `, ${quotDetails.customerDetils.addressLine3}`}
              </>
            ) : (
              ""
            )}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: "10px",
              marginLeft: "40px",
              marginRight: "85px",
            }}
          >
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.tablecell}>QTY</Text>
              <Text style={styles.tablecell2}>
                {quotDetails.apprvedTotalUnits}
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text
                style={{ ...styles.tablecell, borderLeft: 0, borderRight: 0 }}
              >
                Item
              </Text>
              <Text
                style={{ ...styles.tablecell2, borderLeft: 0, borderRight: 0 }}
              >
                {window}
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.tablecell}>Material</Text>
              <Text style={styles.tablecell2}>
                {fabs.length === 0
                  ? "-"
                  : fabs.map((fab, index) => (
                      <React.Fragment key={index}>
                        {fab.fabricName}
                        {index < fabs.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text
                style={{ ...styles.tablecell, borderLeft: 0, borderRight: 0 }}
              >
                Emblishment
              </Text>
              <Text
                style={{ ...styles.tablecell2, borderLeft: 0, borderRight: 0 }}
              >
                <DocSubType type={doc} />
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.tablecell}>Unit Price (LKR)</Text>
              <Text style={styles.tablecell2}>
                {quotDetails.apprvedSellingPrice}
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={{ ...styles.tablecell, borderLeft: 0 }}>
                Amount (LKR)
              </Text>
              <Text style={{ ...styles.tablecell2, borderLeft: 0 }}>
                {quotDetails.apprvedRevanue}
              </Text>
            </View>
          </View>

          <Text style={styles.heading}>Terms & Conditions</Text>
          {selectedOption === "1" ? (
            <Text style={styles.points}>
              1. {percentage}% advance payment with the confirmation of the
              order & balance is due on prior to collection.
            </Text>
          ) : selectedOption === "2" ? (
            <Text style={styles.points}>
              1. {percentage}% advance payment with the confirmation of the
              order & balance is due within {termDay} days credit after the
              delivery.
            </Text>
          ) : selectedOption === "3" ? (
            <Text style={styles.points}>
              1. Purchase Order (PO) with the confirmation of the order &
              payment is due within {termDay} days credit after the delivery.
            </Text>
          ) : (
            ""
          )}

          <Text style={styles.points}>
            2. This quotation is valid {validDate} days from {startDate}
          </Text>
          <Text style={styles.points}>
            3. The above mentioned prices are given by calculating for an
            average size ratio, if they doesn't match with our calculations the
            prices might get differ.
          </Text>
          <Text style={styles.points}>
            4. To handover the order on your required date the order must be
            placed {handoverDate} working days prior to the date of delivery.
          </Text>
          <Text style={styles.points}>
            5. Please be kind enough to issue the cheques for the payment
            regarding this order to the following account.
          </Text>

          <View style={{ marginTop: "10px" }}>
            <Text style={styles.add}>Tailor Made apparels,</Text>
            <Text style={styles.add}>200010000964,</Text>
            <Text style={styles.add}>Hatton National Bank ,</Text>
            <Text style={styles.add}>Hakmana Branch.</Text>
          </View>
          <View style={{ marginTop: "10px" }}>
            <Text style={styles.add}>
              Your concern regarding this is highly appreciated.
            </Text>
            <Text style={styles.add}>Thank You.</Text>
          </View>
          <Image style={styles.sign} src="/images/quotation/sign.png" />
          <View style={{ marginTop: "50px" }}>
            {/* <Text style={styles.add}>---------------------</Text> */}
            <Text style={styles.add}>Yours Faithfully</Text>
            <Text style={styles.add}>Deshitha R Kumara</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const handleShareOpen = () => {
    const url = shareURL;
    if (!url) {
      setMessage("Please Save Quotation Before Sharing");
      return;
    } else {
      setMessage("");
    }
    setOpenShare(true);
  };

  const handleSave = () => {
    UploadPDF();
  };

  const UploadPDF = async () => {
    const pdfContent = MyDocument;
    try {
      const blob = await pdf(pdfContent).toBlob();
      const formData = new FormData();
      formData.append("File", blob, `quotation.${quotDetails.inqCode}.pdf`);
      formData.append("InquiryID", quotDetails.inquiryID);
      formData.append("InqCode", quotDetails.inqCode);
      formData.append("WindowType", quotDetails.windowType);
      formData.append("OptionId", quotDetails.optionId);
      formData.append("DocumentType", 7);
      formData.append("DocumentContentType", 6);
      formData.append("DocumentSubContentType", 5);
      formData.append("FileName", `quotation.${quotDetails.InqCode}.pdf`);

      const response = await fetch(`${BASE_URL}/AWS/DocumentUpload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const resultURL = data.result;
        setShareURL(resultURL);
        setMessage("");
      } else {
        //console.error("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        View PDF
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              mt={3}
              mb={3}
              display="flex"
              justifyContent="space-between"
            >
              <Box>
                <Button variant="outlined" sx={{ ml: 1 }} onClick={handleSave}>
                  Save Quotation
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={handleShareOpen}
                >
                  <ShareIcon sx={{ mr: 3 }} /> Share
                </Button>
              </Box>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                color="error"
                onClick={handleClose}
              >
                Close
              </Button>
            </Grid>
            <Typography sx={{ mb: 2 }} color="error">
              {message ? message : ""}
            </Typography>
            <Grid item xs={12}>
              <PDFViewer width={800} height={500}>
                {MyDocument}
              </PDFViewer>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openShare}
        onClose={handleShareClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-black">
          <Grid container>
            <Grid item xs={12} mt={2}>
              <Typography
                as="h4"
                sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  mb: "12px",
                }}
              >
                Share On
              </Typography>
            </Grid>
            <Grid item xs={4} mt={2}>
              <Card
                sx={{
                  boxShadow: "none",
                  borderRadius: "10px",
                  p: "25px",
                  mb: "15px",
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url('/images/quotation/w.png')`,
                  position: "relative",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border:
                    selectedCard === 0
                      ? "3px solid #757fef"
                      : "1px solid #e5e5e5",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(0)}
              ></Card>
            </Grid>
            <Grid item xs={4} mt={2}>
              <Card
                sx={{
                  boxShadow: "none",
                  borderRadius: "10px",
                  p: "25px",
                  mb: "15px",
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url('/images/quotation/e.jpg')`,
                  position: "relative",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border:
                    selectedCard === 1
                      ? "3px solid #757fef"
                      : "1px solid #e5e5e5",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(1)}
              ></Card>
            </Grid>
            <Grid item xs={4} mt={2}>
              <Card
                sx={{
                  boxShadow: "none",
                  borderRadius: "10px",
                  p: "25px",
                  mb: "15px",
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url('/images/quotation/m.jpg')`,
                  position: "relative",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border:
                    selectedCard === 2
                      ? "3px solid #757fef"
                      : "1px solid #e5e5e5",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(2)}
              ></Card>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button variant="outlined" onClick={handleShareNow}>
                Share Now
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
