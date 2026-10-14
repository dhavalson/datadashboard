import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generatePivotReport } from './reportAggregator';
import { fetchRSSDetails } from '../../redux/rssSlice';
import { fetchSalesReturnDetails } from '../../redux/salesReturnSlice';
import { fetchPaymentDetails } from '../../redux/paymentSlice';

const formatCurrency = (amount) =>
  Math.round(amount || 0).toLocaleString('en-IN');

const TerritoryReportTable = ({ rawInvoiceData: propData }) => {
  const dispatch = useDispatch();

  // Extract primary invoice data from Redux
  const reduxInvoiceData = useSelector((state) => {
    if (Array.isArray(state.rss?.data)) return state.rss.data;
    if (Array.isArray(state.rss)) return state.rss;
    return [];
  });

  // Extract sales return data from Redux
  const salesReturnData = useSelector((state) => {
    const sr = state.salesReturn || state.salesreturn;
    if (Array.isArray(sr?.data)) return sr.data;
    if (Array.isArray(sr)) return sr;
    return [];
  });

  // Extract payment received data from Redux
  const paymentData = useSelector((state) => {
    const py = state.payment;
    if (Array.isArray(py?.data)) return py.data;
    if (Array.isArray(py)) return py;
    return [];
  });

  const invoiceData = propData && propData.length > 0 ? propData : reduxInvoiceData;

  // Dispatch initial fetches once on mount
  useEffect(() => {
    dispatch(fetchRSSDetails());
    dispatch(fetchSalesReturnDetails());
    dispatch(fetchPaymentDetails());
  }, [dispatch]);

  // Process pivot data with Primary, Return, and Payment data sets
  const {
    zones,
    grandTotalPrimary,
    grandTotalReturn,
    grandTotalNet,
    grandTotalPayment,
    grandTotalBalance
  } = useMemo(
    () => generatePivotReport(invoiceData, salesReturnData, paymentData),
    [invoiceData, salesReturnData, paymentData]
  );

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Territory</th>
            <th style={styles.th}>PARTICULAR</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Sum of Primary</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Sales Return</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Net Primary</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Payment Received</th>
            {/* <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th> */}
          </tr>
        </thead>
        <tbody>
          {Object.keys(zones).length > 0 ? (
            Object.entries(zones).map(([zoneName, zoneData]) => (
              <React.Fragment key={zoneName}>
                {Object.entries(zoneData.territories).map(([territoryName, territoryData]) => {
                  const particularEntries = Object.entries(territoryData.particulars);
                  const rowCount = particularEntries.length;

                  const territoryPrimary = territoryData.totalPrimary;
                  const territoryReturn = territoryData.totalReturn;
                  const territoryNet = territoryPrimary - territoryReturn;
                  const territoryPayment = territoryData.totalPayment;
                  // const territoryBalance = territoryNet - territoryPayment;

                  return (
                    <React.Fragment key={territoryName}>
                      {particularEntries.map(([particularName, metrics], index) => {
                        const primary = metrics.primary || 0;
                        const returnAmt = metrics.returnAmt || 0;
                        const netPrimary = primary - returnAmt;
                        const paymentAmt = metrics.paymentAmt || 0;
                        // const balance = netPrimary - paymentAmt;

                        return (
                          <tr key={particularName}>
                            {index === 0 && (
                              <td
                                rowSpan={rowCount}
                                style={styles.territoryCell}
                              >
                                {territoryName}
                              </td>
                            )}
                            <td style={styles.particularCell}>{particularName}</td>
                            <td style={styles.amountCell}>{formatCurrency(primary)}</td>
                            <td style={styles.amountCell}>{formatCurrency(returnAmt)}</td>
                            <td style={{ ...styles.amountCell, fontWeight: '600' }}>
                              {formatCurrency(netPrimary)}
                            </td>
                            <td style={styles.amountCell}>{formatCurrency(paymentAmt)}</td>
                            {/* <td style={{ ...styles.amountCell, fontWeight: '600', color: balance < 0 ? '#dc2626' : '#0f172a' }}>
                              {formatCurrency(balance)}
                            </td> */}
                          </tr>
                        );
                      })}

                      {/* Territory Subtotal Row */}
                      <tr style={styles.subtotalRow}>
                        <td colSpan={2} style={styles.subtotalLabel}>
                          {territoryName} Total
                        </td>
                        <td style={styles.subtotalAmount}>{formatCurrency(territoryPrimary)}</td>
                        <td style={styles.subtotalAmount}>{formatCurrency(territoryReturn)}</td>
                        <td style={styles.subtotalAmount}>{formatCurrency(territoryNet)}</td>
                        <td style={styles.subtotalAmount}>{formatCurrency(territoryPayment)}</td>
                        {/* <td style={styles.subtotalAmount}>{formatCurrency(territoryBalance)}</td> */}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                No invoice records available to summarize.
              </td>
            </tr>
          )}

          {/* Grand Total Row */}
          <tr style={styles.grandTotalRow}>
            <td colSpan={2} style={styles.grandTotalLabel}>
              Grand Total
            </td>
            <td style={styles.grandTotalAmount}>{formatCurrency(grandTotalPrimary)}</td>
            <td style={styles.grandTotalAmount}>{formatCurrency(grandTotalReturn)}</td>
            <td style={styles.grandTotalAmount}>{formatCurrency(grandTotalNet)}</td>
            <td style={styles.grandTotalAmount}>{formatCurrency(grandTotalPayment)}</td>
            {/* <td style={styles.grandTotalAmount}>{formatCurrency(grandTotalBalance)}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxHeight: 'calc(100vh - 160px)',
    overflowY: 'auto',
    overflowX: 'auto',
    margin: '16px 0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '14px'
  },
  th: {
    backgroundColor: '#0f4c81',
    color: '#ffffff',
    padding: '10px 12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #0b3c66',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  territoryCell: {
    backgroundColor: '#cbe5f8',
    color: '#000000',
    fontWeight: 'bold',
    verticalAlign: 'top',
    padding: '10px 12px',
    border: '1px solid #cbd5e1'
  },
  particularCell: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    color: '#1e293b'
  },
  amountCell: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    textAlign: 'right',
    color: '#0f172a'
  },
  subtotalRow: {
    backgroundColor: '#82c0e9'
  },
  subtotalLabel: {
    padding: '8px 12px',
    fontWeight: 'bold',
    color: '#000000',
    border: '1px solid #cbd5e1'
  },
  subtotalAmount: {
    padding: '8px 12px',
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000000',
    border: '1px solid #cbd5e1'
  },
  grandTotalRow: {
    backgroundColor: '#ffffff'
  },
  grandTotalLabel: {
    padding: '10px 12px',
    fontWeight: 'bold',
    color: '#000000',
    border: '1px solid #cbd5e1'
  },
  grandTotalAmount: {
    padding: '10px 12px',
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000000',
    border: '1px solid #cbd5e1'
  }
};

export default TerritoryReportTable;