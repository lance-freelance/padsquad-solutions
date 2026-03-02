import { format } from 'date-fns'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer'

const navy = '#14133A'
const pink = '#F0629E'
const teal = '#84D6E2'
const gray = '#898A9E'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: navy,
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: pink,
    paddingBottom: 12,
  },
  logoPlaceholder: {
    width: 120,
    height: 32,
    backgroundColor: navy,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: gray,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: navy,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6EC',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: teal + '30',
    borderBottomWidth: 1,
    borderBottomColor: navy,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  colDate: { width: '22%', textAlign: 'left' },
  colBD: { width: '12%', textAlign: 'center' },
  colLabel: { width: '66%', textAlign: 'left' },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: gray,
  },
})

/**
 * Branded PDF: PadSquad colors, logo placeholder, milestone table.
 */
export function PdfDocument({ milestones = [], anchorDate, dateType, designMode }) {
  const anchorStr = anchorDate ? format(anchorDate, 'MMM d, yyyy') : '—'
  const modeStr = dateType === 'go-live' ? 'Go-live' : 'Kick-off'
  const designStr = designMode === 'client' ? 'Client design' : 'PadSquad design'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.title}>Campaign Timelines & Schedule</Text>
          <Text style={styles.subtitle}>
            {modeStr} date: {anchorStr} · {designStr}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Production timeline</Text>
          <View style={styles.rowHeader}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colBD}>BD</Text>
            <Text style={styles.colLabel}>Milestone</Text>
          </View>
          {milestones.map((m, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.colDate}>{format(m.date, 'MMM d, yyyy')}</Text>
              <Text style={styles.colBD}>{m.bdOffset}</Text>
              <Text style={styles.colLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>PadSquad · solutions.padsquad.com</Text>
          <Text>Generated {format(new Date(), 'MMM d, yyyy')}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default PdfDocument
